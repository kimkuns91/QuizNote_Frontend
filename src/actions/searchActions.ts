'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export interface ISearchResultItem {
  id: string;
  title: string;
  path?: string;
  type: 'file' | 'folder' | 'document';
  description?: string;
}

export async function searchContent(query: string): Promise<ISearchResultItem[]> {
  try {
    if (!query.trim()) {
      return [];
    }

    // 사용자 인증 정보 확인
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('인증되지 않은 사용자입니다.');
    }

    // 이메일로 사용자 ID 조회
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const userId = user.id;

    // 검색어를 소문자로 변환하여 대소문자 구분 없이 검색
    const searchTerm = `%${query.toLowerCase()}%`;

    // 강의 검색
    const lectures = await prisma.lecture.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
    });

    // 강의 노트 검색
    const lectureNotes = await prisma.lectureNote.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        lectureId: true,
        createdAt: true,
      },
    });

    // 퀴즈 검색
    const quizzes = await prisma.quiz.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        lectureId: true,
        createdAt: true,
      },
    });

    // 결과를 통합하여 반환 형식에 맞게 가공
    const lectureResults: ISearchResultItem[] = lectures.map((lecture) => ({
      id: lecture.id,
      title: lecture.title,
      type: 'document',
      description: lecture.description || `생성일: ${lecture.createdAt.toLocaleDateString()}`,
      path: `/lectures/${lecture.id}`,
    }));

    const noteResults: ISearchResultItem[] = lectureNotes.map((note) => ({
      id: note.id,
      title: note.title,
      type: 'file',
      description: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
      path: `/notes/${note.id}`,
    }));

    const quizResults: ISearchResultItem[] = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      type: 'file',
      description: quiz.description || '퀴즈',
      path: `/quiz/${quiz.id}`,
    }));

    // 모든 결과 통합
    const allResults = [...lectureResults, ...noteResults, ...quizResults];

    // 최근 생성된 항목이 상위에 오도록 정렬
    return allResults;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return [];
  }
} 