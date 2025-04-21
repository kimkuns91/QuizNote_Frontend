import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import crypto from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { prisma } from '@/lib/prisma';

// S3 클라이언트 초기화
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 파일 타입 확인
function isAudioFile(file: { name: string; type: string }): boolean {
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

export async function POST(request: Request) {
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const session = await auth();

    if (!session?.user?.id) {
      console.log('No session or user ID found'); // 세션/사용자 ID 없음 로깅
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }// 사용자 ID 로깅

    const body = await request.json();
    const { fileName, fileType, fileSize } = body;

    if (!isAudioFile({ name: fileName, type: fileType })) {
      return NextResponse.json(
        { error: '오디오 파일만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }

    const uniqueFileName = generateUniqueFileName(fileName);
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    if (!bucketName) {
      return NextResponse.json(
        { error: 'S3 버킷 이름이 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const s3Key = `audio/${uniqueFileName}`;

    // presigned URL 생성
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 3600, // 1시간 유효
    });

    // DB에 파일 정보 저장
    const audioFile = await prisma.mediaFile.create({
      data: {
        fileName: fileName,
        fileSize: fileSize,
        fileType: fileType,
        mediaType: 'audio',
        s3Key: s3Key,
        s3Url: presignedUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      presignedUrl,
      audioFile,
    });
  } catch (error) {
    console.error('오디오 파일 처리 에러:', error);
    return NextResponse.json(
      { error: '오디오 파일 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 