'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * 강의노트 목록을 가져오는 액션
 */
export async function getLectureNotes() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }
    
    const lectureNotes = await prisma.lectureNote.findMany({
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
      data: lectureNotes.map(note => ({
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
      }))
    };
  } catch (error) {
    console.error('강의노트 목록 조회 오류:', error);
    return { success: false, error: '강의노트 목록을 불러오는 중 오류가 발생했습니다.' };
  }
}

/**
 * 특정 강의노트의 상세 정보를 가져오는 액션
 */
export async function getLectureNoteById(noteId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }
    
    const lectureNote = await prisma.lectureNote.findUnique({
      where: {
        id: noteId,
        userId: session.user.id,
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
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
    });
    
    if (!lectureNote) {
      return { success: false, error: '해당 강의노트를 찾을 수 없습니다.' };
    }
    
    return { success: true, data: lectureNote };
  } catch (error) {
    console.error('강의노트 상세 조회 오류:', error);
    return { success: false, error: '강의노트 상세정보를 불러오는 중 오류가 발생했습니다.' };
  }
}

/**
 * 새 강의노트를 생성하는 액션
 */
export async function createLectureNote(data: {
  title: string;
  content: string;
  tags: string[];
  isPublic?: boolean;
  lectureId: string;
}) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }
    
    const lectureNote = await prisma.lectureNote.create({
      data: {
        title: data.title,
        content: data.content,
        tags: data.tags,
        isPublic: data.isPublic || false,
        userId: session.user.id,
        lectureId: data.lectureId,
      },
    });
    
    revalidatePath('/dashboard/notes');
    return { success: true, data: lectureNote };
  } catch (error) {
    console.error('강의노트 생성 오류:', error);
    return { success: false, error: '강의노트를 생성하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 강의노트를 업데이트하는 액션
 */
export async function updateLectureNote(
  noteId: string,
  data: {
    title?: string;
    content?: string;
    tags?: string[];
    isPublic?: boolean;
  }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }
    
    // 노트의 소유자 확인
    const note = await prisma.lectureNote.findUnique({
      where: {
        id: noteId,
        userId: session.user.id,
      },
    });
    
    if (!note) {
      return { success: false, error: '해당 강의노트를 찾을 수 없거나 수정 권한이 없습니다.' };
    }
    
    const updatedNote = await prisma.lectureNote.update({
      where: {
        id: noteId,
      },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.tags && { tags: data.tags }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
    });
    
    revalidatePath(`/dashboard/notes/${noteId}`);
    revalidatePath('/dashboard/notes');
    
    return { success: true, data: updatedNote };
  } catch (error) {
    console.error('강의노트 업데이트 오류:', error);
    return { success: false, error: '강의노트를 업데이트하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 강의노트를 삭제하는 액션
 */
export async function deleteLectureNote(noteId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }
    
    // 노트의 소유자 확인
    const note = await prisma.lectureNote.findUnique({
      where: {
        id: noteId,
        userId: session.user.id,
      },
    });
    
    if (!note) {
      return { success: false, error: '해당 강의노트를 찾을 수 없거나 삭제 권한이 없습니다.' };
    }
    
    // 노트와 관련된 섹션들도 함께 삭제됩니다 (CASCADE)
    await prisma.lectureNote.delete({
      where: {
        id: noteId,
      },
    });
    
    revalidatePath('/dashboard/notes');
    
    return { success: true, data: { id: noteId } };
  } catch (error) {
    console.error('강의노트 삭제 오류:', error);
    return { success: false, error: '강의노트를 삭제하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 강의노트 섹션을 생성하는 액션
 */
export async function createNoteSection(data: {
  noteId: string;
  title: string;
  content: string;
  order: number;
}) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }
    
    // 노트의 소유자 확인
    const note = await prisma.lectureNote.findUnique({
      where: {
        id: data.noteId,
        userId: session.user.id,
      },
    });
    
    if (!note) {
      return { success: false, error: '해당 강의노트를 찾을 수 없거나 권한이 없습니다.' };
    }
    
    const section = await prisma.noteSection.create({
      data: {
        title: data.title,
        content: data.content,
        order: data.order,
        noteId: data.noteId,
      },
    });
    
    revalidatePath(`/dashboard/notes/${data.noteId}`);
    
    return { success: true, data: section };
  } catch (error) {
    console.error('강의노트 섹션 생성 오류:', error);
    return { success: false, error: '강의노트 섹션을 생성하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 강의노트 섹션을 업데이트하는 액션
 */
export async function updateNoteSection(
  sectionId: string,
  data: {
    title?: string;
    content?: string;
    order?: number;
  }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }
    
    // 섹션 조회
    const section = await prisma.noteSection.findUnique({
      where: {
        id: sectionId,
      },
      include: {
        lectureNote: true,
      },
    });
    
    if (!section) {
      return { success: false, error: '해당 섹션을 찾을 수 없습니다.' };
    }
    
    // 노트의 소유자 확인
    if (section.lectureNote.userId !== session.user.id) {
      return { success: false, error: '해당 섹션을 수정할 권한이 없습니다.' };
    }
    
    const updatedSection = await prisma.noteSection.update({
      where: {
        id: sectionId,
      },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
    
    revalidatePath(`/dashboard/notes/${section.lectureNote.id}`);
    
    return { success: true, data: updatedSection };
  } catch (error) {
    console.error('강의노트 섹션 업데이트 오류:', error);
    return { success: false, error: '강의노트 섹션을 업데이트하는 중 오류가 발생했습니다.' };
  }
}

/**
 * 강의노트 섹션을 삭제하는 액션
 */
export async function deleteNoteSection(sectionId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }
    
    // 섹션 조회
    const section = await prisma.noteSection.findUnique({
      where: {
        id: sectionId,
      },
      include: {
        lectureNote: true,
      },
    });
    
    if (!section) {
      return { success: false, error: '해당 섹션을 찾을 수 없습니다.' };
    }
    
    // 노트의 소유자 확인
    if (section.lectureNote.userId !== session.user.id) {
      return { success: false, error: '해당 섹션을 삭제할 권한이 없습니다.' };
    }
    
    await prisma.noteSection.delete({
      where: {
        id: sectionId,
      },
    });
    
    revalidatePath(`/dashboard/notes/${section.lectureNote.id}`);
    
    return { success: true, data: { id: sectionId } };
  } catch (error) {
    console.error('강의노트 섹션 삭제 오류:', error);
    return { success: false, error: '강의노트 섹션을 삭제하는 중 오류가 발생했습니다.' };
  }
}