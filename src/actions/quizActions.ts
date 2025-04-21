'use server'

import { IQuiz, IQuizResult } from '@/hooks/useQuiz';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 퀴즈 목록 조회
export async function getQuizzes(): Promise<{ success: true; data: IQuiz[] } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: quizzes.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty as 'easy' | 'medium' | 'hard',
        isPublic: quiz.isPublic,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
        questions: quiz.questions.map(q => ({
          id: q.id,
          question: q.question,
          type: q.type as 'multiple-choice',
          points: q.points,
          order: q.order,
          options: q.options.map(opt => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order,
          })),
        })),
      })),
    };
  } catch (error) {
    console.error('퀴즈 목록 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '퀴즈 목록 조회 중 오류가 발생했습니다.',
    };
  }
}

// 단일 퀴즈 조회
export async function getQuiz(quizId: string): Promise<{ success: true; data: IQuiz } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
        userId: session.user.id,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!quiz) {
      return { success: false, error: '퀴즈를 찾을 수 없습니다.' };
    }

    // IQuiz 타입에 맞게 데이터 변환
    const formattedQuiz: IQuiz = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty as 'easy' | 'medium' | 'hard',
      isPublic: quiz.isPublic,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      questions: quiz.questions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type as 'multiple-choice',
        points: q.points,
        order: q.order,
        options: q.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
          order: opt.order
        }))
      }))
    };

    return { success: true, data: formattedQuiz };
  } catch (error) {
    console.error('퀴즈 조회 중 오류 발생:', error);
    return { success: false, error: '퀴즈 조회 중 오류가 발생했습니다.' };
  }
}

// 퀴즈 결과 제출
export async function submitQuizResult(
  quizId: string,
  answers: { questionId: string; answer: string }[]
): Promise<{ success: true; data: IQuizResult } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return {
        success: false,
        error: '퀴즈를 찾을 수 없습니다.',
      };
    }

    // 정답 확인 및 점수 계산
    let score = 0;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const userAnswers = [];

    for (const answer of answers) {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      const isCorrect = question.options.some(
        opt => opt.isCorrect && opt.text === answer.answer
      );

      if (isCorrect) {
        score += question.points;
      }

      userAnswers.push({
        questionId: question.id,
        answer: answer.answer,
        isCorrect,
      });
    }

    // 퀴즈 결과 저장
    const result = await prisma.quizResult.create({
      data: {
        score,
        totalPoints,
        completedAt: new Date(),
        quizId,
        userId: session.user.id,
        answers: {
          create: userAnswers.map(answer => ({
            answer: answer.answer,
            isCorrect: answer.isCorrect,
            questionId: answer.questionId,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return {
      success: true,
      data: {
        id: result.id,
        score,
        totalPoints,
        completedAt: result.completedAt,
        answers: result.answers.map(a => ({
          questionId: a.questionId,
          answer: a.answer,
          isCorrect: a.isCorrect,
        })),
      },
    };
  } catch (error) {
    console.error('퀴즈 결과 제출 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '퀴즈 결과 제출 중 오류가 발생했습니다.',
    };
  }
}
