import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    console.error('오디오 파일 상태 업데이트 에러:', error);
    return NextResponse.json(
      { error: '오디오 파일 상태 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 