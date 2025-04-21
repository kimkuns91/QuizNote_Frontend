'use server';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { auth } from '@/lib/auth';
import crypto from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { prisma } from '@/lib/prisma';

// 환경 변수 디버깅 로그
console.log('S3 설정 디버깅:', {
  region: !!process.env.AWS_REGION,
  bucketName: !!process.env.AWS_S3_BUCKET_NAME,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
});

// S3 클라이언트 초기화
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 파일 타입 확인
function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/') || 
    ['.mp3', '.wav', '.m4a', '.ogg', '.aiff', '.caf'].some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
}

// 고유한 파일 이름 생성
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}

// FormData에서 파일 추출
async function extractFileFromFormData(formData: FormData): Promise<File | null> {
  const file = formData.get('file') as File;
  
  if (!file || !(file instanceof File)) {
    return null;
  }
  
  return file;
}

// 파일 정보를 데이터베이스에 저장
async function saveFileToDatabase(
  uniqueFileName: string,
  originalName: string,
  fileType: string,
  fileSize: number
) {
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      throw new Error('로그인이 필요합니다.');
    }
    
    const mediaFile = await prisma.mediaFile.create({
      data: {
        fileName: originalName,
        fileSize: fileSize,
        fileType: fileType,
        mediaType: fileType.startsWith('audio/') ? 'audio' : 'video',
        s3Key: `audio/${uniqueFileName}`,
        s3Url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-northeast-2'}.amazonaws.com/audio/${uniqueFileName}`,
        userId: session.user.id,
      },
    });
    
    return mediaFile;
  } catch (error) {
    console.error('파일 정보 DB 저장 에러:', error);
    throw new Error('파일 정보를 데이터베이스에 저장하는 중 오류가 발생했습니다.');
  }
}

// S3 버킷에 오디오 파일 업로드
export async function uploadAudioToS3(formData: FormData) {
  try {
    const file = await extractFileFromFormData(formData);
    
    if (!file) {
      return { success: false, error: '파일을 찾을 수 없습니다.' };
    }
    
    if (!isAudioFile(file)) {
      return { success: false, error: '오디오 파일만 업로드할 수 있습니다.' };
    }
    
    const uniqueFileName = generateUniqueFileName(file.name);
    
    // 버킷 이름 설정 - 환경 변수에서 가져오거나 기본값 사용
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    if (!bucketName) {
      console.error('S3 버킷 이름이 설정되지 않았습니다.');
      return { success: false, error: 'S3 버킷 이름 설정이 누락되었습니다.' };
    }
    
    console.log('사용할 버킷 이름:', bucketName);
    
    // FormData에서 파일 내용을 ArrayBuffer로 변환
    const fileBuffer = await file.arrayBuffer();
    
    // S3에 파일 업로드
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: `audio/${uniqueFileName}`,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    });
    
    await s3Client.send(putCommand);
    
    // 업로드된 파일에 대한 서명된 URL 생성 (30분 유효)
    const getCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: `audio/${uniqueFileName}`,
    });
    
    const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 1800 });
    
    // DB에 파일 정보 저장
    const fileInfo = await saveFileToDatabase(uniqueFileName, file.name, file.type, file.size);
    
    // 파일 정보 반환
    return {
      success: true,
      fileKey: `audio/${uniqueFileName}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: signedUrl,
      fileId: fileInfo.id,
    };
  } catch (error) {
    console.error('S3 업로드 에러:', error);
    return { success: false, error: '파일 업로드 중 오류가 발생했습니다.' };
  }
} 