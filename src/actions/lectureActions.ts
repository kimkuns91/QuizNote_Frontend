'use server'

import { Lecture } from "@/hooks/useLecture";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Lecture 생성을 위한 인터페이스
interface LectureCreationOptions {
  mediaFileId: string;
  title: string;
  description?: string;
  selectedModel: string;
  selectedLanguage: string;
  useTranscriptEditing: boolean;
  s3Key: string;
}

/**
 * 새로운 Lecture 레코드를 생성하고 변환을 시작하는 함수
 */
export async function createLecture(options: LectureCreationOptions) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    console.log('createLecture 호출됨:', options);
    
    // Lecture 생성
    const newLecture = await prisma.lecture.create({
      data: {
        title: options.title,
        description: options.description,
        mediaFileId: options.mediaFileId,
        userId: session.user.id,
        processingStatus: 'pending',
        selectedModel: options.selectedModel,
        selectedLanguage: options.selectedLanguage,
        useTranscriptEditing: options.useTranscriptEditing,
      },
    });
    
    console.log('Lecture 생성 완료:', newLecture.id);

    // FastAPI 서버에 비동기 변환 요청
    const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    console.log('FastAPI 요청 URL:', `${fastApiUrl}/api/transcription`);
    
    const requestBody = {
      lecture_id: newLecture.id,
      media_file_id: options.mediaFileId,
      s3_key: options.s3Key,
      title: options.title,
      description: options.description,
      user_id: session.user.id,
      model: options.selectedModel,
      language: options.selectedLanguage,
      use_transcript_editing: options.useTranscriptEditing,
    };
    
    console.log('FastAPI 요청 본문:', requestBody);
    
    const response = await fetch(`${fastApiUrl}/api/transcription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // 응답 처리
    let taskId = null;
    let responseData = null;
    
    if (response.ok) {
      responseData = await response.json();
      taskId = responseData.result?.task_id;
      console.log('FastAPI 응답 성공:', responseData);
      console.log('추출된 태스크 ID:', taskId);
    } else {
      const errorText = await response.text();
      console.error('FastAPI 요청 실패:', response.status, errorText);
    }

    // task_id를 포함하여 성공 응답
    const result = {
      success: true,
      lectureId: newLecture.id,
      taskId: taskId,
      message: '강의가 생성되었습니다. 처리가 완료되면 알림을 보내드립니다.',
    };
    
    console.log('createLecture 최종 결과:', result);
    return result;
  } catch (error) {
    console.error('Lecture 생성 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '강의 생성 중 오류가 발생했습니다.',
    };
  }
}

/**
 * Lecture 상태를 조회하는 함수
 */
export async function getLectureStatus(lectureId: string) {
  try {
    const response = await fetch(`/api/lectures/${lectureId}/status`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '강의 상태 조회 중 오류가 발생했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('Lecture 상태 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '강의 상태 조회 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 강의 목록을 조회하는 함수
 */
export async function getLectures(page = 1, limit = 24): Promise<{ success: true; data: Lecture[]; hasMore: boolean } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const skip = (page - 1) * limit;
    
    // 총 강의 개수 조회
    const totalCount = await prisma.lecture.count({
      where: {
        userId: session.user.id,
      },
    });
    
    const lectures = await prisma.lecture.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        mediaFile: true,
        lectureNote: {
          include: {
            sections: true,
            lecture: {
              include: {
                mediaFile: true
              }
            }
          }
        },
        quiz: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return {
      success: true,
      data: lectures.map(lecture => ({
        ...lecture,
        lectureNote: lecture.lectureNote ? {
          ...lecture.lectureNote,
          lecture: {
            id: lecture.id,
            title: lecture.title,
            mediaFile: lecture.mediaFile
          }
        } : null,
        quiz: lecture.quiz ? {
          id: lecture.quiz.id,
          title: lecture.quiz.title,
          description: lecture.quiz.description,
          difficulty: lecture.quiz.difficulty,
          isPublic: lecture.quiz.isPublic,
          createdAt: lecture.quiz.createdAt,
          updatedAt: lecture.quiz.updatedAt,
          questions: lecture.quiz.questions.map(q => ({
            id: q.id,
            question: q.question,
            type: q.type,
            points: q.points,
            order: q.order,
            options: q.options.map(opt => ({
              id: opt.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
              order: opt.order
            }))
          }))
        } : null
      })),
      hasMore: skip + lectures.length < totalCount,
    };
  } catch (error) {
    console.error('강의 목록 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '강의 목록 조회 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 단일 강의를 조회하는 함수
 */
export async function getLecture(lectureId: string): Promise<{ success: true; data: Lecture } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const lecture = await prisma.lecture.findUnique({
      where: {
        id: lectureId,
        userId: session.user.id,
      },
      include: {
        mediaFile: true,
        lectureNote: true,
        quiz: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!lecture) {
      return {
        success: false,
        error: '강의를 찾을 수 없습니다.',
      };
    }

    return {
      success: true,
      data: {
        ...lecture,
        quiz: lecture.quiz ? {
          id: lecture.quiz.id,
          title: lecture.quiz.title,
          description: lecture.quiz.description,
          difficulty: lecture.quiz.difficulty,
          isPublic: lecture.quiz.isPublic,
          createdAt: lecture.quiz.createdAt,
          updatedAt: lecture.quiz.updatedAt,
          questions: lecture.quiz.questions.map(q => ({
            id: q.id,
            question: q.question,
            type: q.type,
            points: q.points,
            order: q.order,
            options: q.options.map(opt => ({
              id: opt.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
              order: opt.order
            }))
          }))
        } : null
      },
    };
  } catch (error) {
    console.error('강의 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '강의 조회 중 오류가 발생했습니다.',
    };
  }
}

export async function getLectureNotes() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const notes = await prisma.lectureNote.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        lecture: {
          include: {
            mediaFile: {
              select: {
                id: true,
                fileName: true,
                s3Url: true,
                transcript: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return {
      success: true,
      data: notes.map(note => ({
        ...note,
        lecture: note.lecture ? {
          id: note.lecture.id,
          title: note.lecture.title,
          mediaFile: note.lecture.mediaFile ? {
            id: note.lecture.mediaFile.id,
            fileName: note.lecture.mediaFile.fileName,
            s3Url: note.lecture.mediaFile.s3Url,
            transcript: note.lecture.mediaFile.transcript || '',
          } : undefined,
        } : undefined,
      })),
    };
  } catch (error) {
    console.error('강의노트 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '강의노트 조회 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 강의를 삭제하는 함수
 */
export async function deleteLecture(lectureId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    // 강의 삭제
    await prisma.lecture.delete({
      where: {
        id: lectureId,
        userId: session.user.id, // 사용자 소유의 강의만 삭제 가능
      },
    });

    return {
      success: true,
      message: '강의가 삭제되었습니다.',
    };
  } catch (error) {
    console.error('강의 삭제 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '강의 삭제 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 태스크 상태를 확인하는 함수
 */
export async function getTaskStatus(taskId: string) {
  try {
    console.log('태스크 상태 확인 요청:', taskId);
    
    const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    const url = `${fastApiUrl}/api/transcription/task/${taskId}`;
    console.log('태스크 상태 확인 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('태스크 상태 확인 실패:', response.status, errorText);
      throw new Error('태스크 상태 확인 실패');
    }

    // 전체 응답 데이터 가져오기
    const fullData = await response.json();
    
    // 필요한 정보만 추출하여 데이터 크기 축소
    const minimizedData = {
      task_id: fullData.task_id,
      status: fullData.status,
      error: fullData.error
    };
    
    console.log('태스크 상태 확인 성공 (요약):', minimizedData);
    
    return {
      success: true,
      data: minimizedData,
    };
  } catch (error) {
    console.error('태스크 상태 확인 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '태스크 상태 확인 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 강의를 업데이트하는 함수
 */
export async function updateLecture(lectureId: string, data: {
  title?: string;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    // 강의 소유자 확인
    const lecture = await prisma.lecture.findUnique({
      where: {
        id: lectureId,
        userId: session.user.id,
      },
    });

    if (!lecture) {
      return { success: false, error: '해당 강의를 찾을 수 없거나 수정 권한이 없습니다.' };
    }

    // 강의 업데이트
    const updatedLecture = await prisma.lecture.update({
      where: {
        id: lectureId,
      },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
      },
      include: {
        mediaFile: true,
      }
    });

    revalidatePath(`/lectures/${lectureId}`);
    revalidatePath('/lectures');

    return { success: true, data: updatedLecture };
  } catch (error) {
    console.error('강의 업데이트 오류:', error);
    return { success: false, error: '강의를 업데이트하는 중 오류가 발생했습니다.' };
  }
} 