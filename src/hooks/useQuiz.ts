import { getQuiz, getQuizzes, submitQuizResult } from '@/actions/quizActions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-hot-toast';

export interface IQuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice';
  points: number;
  order: number;
  isAnswered?: boolean;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    order: number;
  }[];
}

export interface IQuiz {
  id: string;
  title: string;
  description: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  isPublic: boolean;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
  questions: IQuizQuestion[];
}

export interface IQuizResult {
  id: string;
  score: number;
  totalPoints: number;
  completedAt: Date;
  answers: {
    questionId: string;
    answer: string;
    isCorrect: boolean;
  }[];
}

// 퀴즈 목록 조회 훅
export function useQuizzes() {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const result = await getQuizzes();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    }
  });
}

// 단일 퀴즈 조회 훅
export function useQuiz(quizId: string) {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const result = await getQuiz(quizId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!quizId,
  });
}

// 퀴즈 결과 제출 훅
export function useSubmitQuizResult() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ quizId, answers }: { quizId: string; answers: { questionId: string; answer: string }[] }) => {
      const result = await submitQuizResult(quizId, answers);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
      toast.success(`퀴즈가 완료되었습니다! 점수: ${data.score}/${data.totalPoints}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// 퀴즈 결과 조회 훅
export function useQuizResult(quizId: string) {
  return useQuery({
    queryKey: ['quiz-result', quizId],
    queryFn: async () => {
      const result = await getQuiz(quizId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!quizId,
  });
} 