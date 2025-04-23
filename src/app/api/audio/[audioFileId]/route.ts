import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import { prisma } from '@/lib/prisma';

// S3 클라이언트 초기화
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// S3 오디오 파일을 스트리밍하는 GET 엔드포인트
export async function GET(
  request: Request,
  { params }: { params: Promise<{ audioFileId: string }> }
) {
  try {
    const { audioFileId } = await params;
    console.log(`오디오 파일 요청: ${audioFileId}`);

    // 미디어 파일 정보 조회
    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id: audioFileId },
    });

    if (!mediaFile) {
      console.error(`파일을 찾을 수 없음: ${audioFileId}`);
      return NextResponse.json(
        { error: '파일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (!mediaFile.s3Key) {
      console.error(`S3 키가 없음: ${audioFileId}`);
      return NextResponse.json(
        { error: 'S3 키가 없습니다.' },
        { status: 400 }
      );
    }

    // S3 버킷 이름 가져오기
    const bucketName = process.env.AWS_S3_BUCKET_NAME || '';
    if (!bucketName) {
      console.error('[ERROR] S3 버킷 이름이 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'S3 버킷 설정 오류' },
        { status: 500 }
      );
    }

    console.log(`S3에서 파일 가져오기: ${bucketName}/${mediaFile.s3Key}`);

    // S3에서 직접 객체 가져오기
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: mediaFile.s3Key,
    });

    try {
      const s3Response = await s3Client.send(command);
      
      if (!s3Response.Body) {
        throw new Error('S3 응답에 본문이 없습니다.');
      }

      // 스트림을 바이트 배열로 변환
      const chunks: Buffer[] = [];
      
      // AWS SDK v3 응답 처리
      const stream = s3Response.Body;
      
      // transformToByteArray 메서드가 있는지 확인
      if (stream && 'transformToByteArray' in stream && typeof stream.transformToByteArray === 'function') {
        // AWS SDK v3의 새로운 방식으로 바이트 배열로 변환
        const byteArray = await stream.transformToByteArray();
        chunks.push(Buffer.from(byteArray));
      } 
      // transformToString 메서드가 있는지 확인
      else if (stream && 'transformToString' in stream && typeof stream.transformToString === 'function') {
        const str = await stream.transformToString();
        chunks.push(Buffer.from(str));
      } 
      // Node.js Readable 스트림인지 확인
      else if (stream instanceof Readable) {
        await new Promise<void>((resolve, reject) => {
          (stream as Readable).on('data', (chunk: Buffer) => chunks.push(chunk));
          (stream as Readable).on('end', () => resolve());
          (stream as Readable).on('error', (err: Error) => reject(err));
        });
      } 
      // Blob 타입인지 확인 (브라우저 환경에서 사용)
      else if (typeof Blob !== 'undefined' && stream instanceof Blob) {
        const arrayBuffer = await (stream as Blob).arrayBuffer();
        chunks.push(Buffer.from(arrayBuffer));
      }
      else {
        // 다른 모든 경우에 대한 폴백 - 가장 공통적인 메서드 시도
        try {
          console.log('일반적인 스트림 처리 시도, 타입:', typeof stream);
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyStream = stream as any;
          
          if (anyStream.transformToByteArray) {
            const byteArray = await anyStream.transformToByteArray();
            chunks.push(Buffer.from(byteArray));
          } else if (anyStream.transformToString) {
            const str = await anyStream.transformToString();
            chunks.push(Buffer.from(str));
          } else if (anyStream.Body && typeof anyStream.Body.transformToByteArray === 'function') {
            const byteArray = await anyStream.Body.transformToByteArray();
            chunks.push(Buffer.from(byteArray));
          } else {
            throw new Error('지원되지 않는 스트림 형식');
          }
        } catch (streamError) {
          console.error('스트림 처리 중 오류:', streamError);
          throw new Error(`스트림을 처리할 수 없습니다: ${streamError instanceof Error ? streamError.message : String(streamError)}`);
        }
      }
      
      const audioBuffer = Buffer.concat(chunks);

      // 파일 확장자 또는 기존 데이터에서 MIME 타입 결정
      let contentType = 'audio/mpeg'; // 기본값
      
      // 먼저 파일 이름에서 확장자 추출
      if (mediaFile.fileName) {
        const extension = mediaFile.fileName.split('.').pop()?.toLowerCase();
        if (extension) {
          switch (extension) {
            case 'mp3':
              contentType = 'audio/mpeg';
              break;
            case 'wav':
            case 'wave':
              contentType = 'audio/wav';
              break;
            case 'ogg':
              contentType = 'audio/ogg';
              break;
            case 'm4a':
              contentType = 'audio/mp4';
              break;
            case 'aac':
              contentType = 'audio/aac';
              break;
            case 'flac':
              contentType = 'audio/flac';
              break;
            case 'webm':
              contentType = 'audio/webm';
              break;
            default:
              // fileType이 있으면 그것을 사용, 없으면 기본값
              contentType = mediaFile.fileType || 'audio/mpeg';
          }
        }
      } else if (mediaFile.fileType) {
        // fileType이 있는 경우 해당 값 사용
        contentType = mediaFile.fileType;
      }
      
      console.log(`오디오 파일 콘텐츠 타입: ${contentType}`);
      console.log(`오디오 전송: ${mediaFile.fileName}, 크기: ${audioBuffer.byteLength} 바이트`);
      
      // 응답 헤더 설정
      const headers = {
        'Content-Type': contentType,
        'Content-Length': audioBuffer.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Content-Type, Range, Origin',
        'Cache-Control': 'public, max-age=3600',
      };
      
      // 변환 없이 원본 그대로 스트리밍
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: headers,
      });
    } catch (s3Error: unknown) {
      console.error('S3 파일 다운로드 오류:', s3Error);
      const errorMessage = s3Error instanceof Error ? s3Error.message : '알 수 없는 오류';
      return NextResponse.json(
        { error: `S3에서 파일을 가져오는 중 오류가 발생했습니다: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('오디오 스트리밍 오류:', error);
    return NextResponse.json(
      { error: '오디오 파일 스트리밍 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ audioFileId: string }> }  
) {
  try {
    const body = await request.json();
    const { transcript } = body;
    const { audioFileId } = await params;

    const audioFile = await prisma.mediaFile.update({
      where: { id: audioFileId },
      data: {
        transcript,
      },
    });

    return NextResponse.json({
      success: true,
      audioFile,
    });
  } catch (error) {
    console.error('오디오 파일 상태 업데이트 오류:', error);
    return NextResponse.json(
      { error: '오디오 파일 상태 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 