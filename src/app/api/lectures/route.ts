import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { mediaFileId, selectedModel, selectedLanguage, useTranscriptEditing } = body;
    
    // 현재 날짜를 기본 강의 제목으로 사용
    const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const formattedDate = dateFormatter.format(new Date());
    
    // MediaFile 정보 조회
    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id: mediaFileId },
    });

    if (!mediaFile) {
      return NextResponse.json(
        { error: '미디어 파일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Lecture 레코드 생성
    const lecture = await prisma.lecture.create({
      data: {
        title: `${formattedDate} 강의`,
        processingStatus: 'pending',
        selectedModel: selectedModel,
        selectedLanguage: selectedLanguage,
        useTranscriptEditing: useTranscriptEditing,
        userId: session.user.id,
        mediaFileId: mediaFileId,
      },
    });

    try {
      // 환경 변수에서 백엔드 API URL 가져오기
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('백엔드 API URL:', apiUrl);
      
      // 백엔드 API에 처리 요청
      const response = await fetch(`${apiUrl}/api/transcription/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          s3_key: mediaFile.s3Key,
          lecture_id: lecture.id,
          model: selectedModel,
          language: selectedLanguage,
          use_transcript_editing: useTranscriptEditing,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('백엔드 API 에러:', errorData);
        
        // 에러 발생 시 Lecture 상태 업데이트
        await prisma.lecture.update({
          where: { id: lecture.id },
          data: { processingStatus: 'failed' },
        });

        return NextResponse.json(
          { error: errorData.detail || '백엔드 처리 요청에 실패했습니다.' },
          { status: response.status }
        );
      }

      const result = await response.json();
      console.log('백엔드 처리 결과:', result);
      
      return NextResponse.json({
        success: true,
        lectureId: lecture.id,
      });
    } catch (error) {
      console.error('백엔드 API 호출 에러:', error);
      
      // 네트워크 에러 등의 경우 Lecture 상태 업데이트
      await prisma.lecture.update({
        where: { id: lecture.id },
        data: { processingStatus: 'failed' },
      });

      return NextResponse.json(
        { error: '백엔드 서버에 연결할 수 없습니다.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Lecture 생성 에러:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '강의 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 