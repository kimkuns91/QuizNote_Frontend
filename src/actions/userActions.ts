'use server';

import { decrypt, encrypt } from '@/lib/crypto';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * 사용자의 학습 활동 통계를 가져옵니다.
 * @returns 사용자의 강의노트 수, 퀴즈 완료 수, 총 학습 시간(분)
 */
export async function getUserStats() {
  try {
    // 세션에서 사용자 정보 가져오기
    const session = await auth();
    if (!session || !session.user?.id) {
      return { 
        notesCount: 0, 
        quizzesCount: 0,
        studyTimeMinutes: 0
      };
    }
    
    // 강의노트 수 조회
    const notesCount = await prisma.lectureNote.count({
      where: { userId: session.user.id }
    });
    
    // 완료한 퀴즈 수 조회
    const quizzesCount = await prisma.quizResult.count({
      where: { userId: session.user.id }
    });
    
    // 학습 시간 계산 (강의 미디어 파일의 duration 합계, 초를 분으로 변환)
    const totalDurationInSeconds = await prisma.mediaFile.aggregate({
      where: {
        userId: session.user.id,
        lectures: {
          some: {
            // 완료된 강의만 포함
            processingStatus: 'completed'
          }
        }
      },
      _sum: {
        duration: true
      }
    });
    
    // 초를 분으로 변환 (없으면 0)
    const studyTimeMinutes = Math.round(
      (totalDurationInSeconds._sum.duration || 0) / 60
    );
    
    return {
      notesCount,
      quizzesCount,
      studyTimeMinutes
    };
  } catch (error) {
    console.error('사용자 통계 조회 중 오류 발생:', error);
    return { 
      notesCount: 0,
      quizzesCount: 0,
      studyTimeMinutes: 0
    };
  }
}

/**
 * Notion API 키를 암호화하여 DB에 저장합니다.
 * @param notionKey Notion API Key
 * @param pageId Notion Page ID (선택 사항)
 */
export async function saveNotionKey(notionKey: string, pageId?: string) {
  try {
    // 세션에서 사용자 정보 가져오기
    const session = await auth();
    if (!session || !session.user?.id) {
      return { success: false, message: '로그인이 필요합니다.' };
    }

    // 키가 비어있지 않은지 확인
    if (!notionKey || notionKey.trim() === '') {
      return { success: false, message: '유효한 Notion API 키를 입력해주세요.' };
    }

    // 키 암호화
    const encryptedKey = encrypt(notionKey);
    
    // 기존 키가 있는지 확인
    const existingKey = await prisma.notionKeys.findFirst({
      where: { userId: session.user.id }
    });

    if (existingKey) {
      // 기존 키 업데이트
      await prisma.notionKeys.update({
        where: { id: existingKey.id },
        data: { 
          token: encryptedKey,
          pageId: pageId || existingKey.pageId
        }
      });
    } else {
      // 새 키 생성
      await prisma.notionKeys.create({
        data: {
          token: encryptedKey,
          pageId: pageId || '',
          userId: session.user.id
        }
      });
    }

    // 경로 재검증 (캐시 업데이트)
    revalidatePath('/settings');
    
    return { success: true, message: 'Notion API 키가 성공적으로 저장되었습니다.' };
  } catch (error) {
    console.error('Notion 키 저장 중 오류 발생:', error);
    return { success: false, message: 'Notion API 키 저장 중 오류가 발생했습니다.' };
  }
}

/**
 * 저장된 Notion API 키를 가져옵니다.
 * @returns 암호화된 키가 없으면 null, 있으면 복호화된 키와 페이지 ID를 포함하는 객체
 */
export async function getNotionKey() {
  try {
    // 세션에서 사용자 정보 가져오기
    const session = await auth();
    if (!session || !session.user?.id) {
      return null;
    }
    
    // DB에서 암호화된 키 가져오기
    const notionKeyData = await prisma.notionKeys.findFirst({
      where: { userId: session.user.id }
    });
    
    if (!notionKeyData) {
      return null;
    }
    
    // 암호화된 키 복호화
    return {
      token: decrypt(notionKeyData.token),
      pageId: notionKeyData.pageId
    };
  } catch (error) {
    console.error('Notion 키 조회 중 오류 발생:', error);
    return null;
  }
}

/**
 * 저장된 Notion API 키를 삭제합니다.
 */
export async function deleteNotionKey() {
  try {
    // 세션에서 사용자 정보 가져오기
    const session = await auth();
    if (!session || !session.user?.id) {
      return { success: false, message: '로그인이 필요합니다.' };
    }
    
    // DB에서 사용자의 Notion 키 삭제
    await prisma.notionKeys.deleteMany({
      where: { userId: session.user.id }
    });
    
    revalidatePath('/settings');
    return { success: true, message: 'Notion API 키가 삭제되었습니다.' };
  } catch (error) {
    console.error('Notion 키 삭제 중 오류 발생:', error);
    return { success: false, message: 'Notion API 키 삭제 중 오류가 발생했습니다.' };
  }
}
