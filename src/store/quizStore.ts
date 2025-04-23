import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IQuizStore {
  answers: Record<string, string>; // questionId: selectedAnswer
  currentQuestion: number;
  setAnswer: (questionId: string, answer: string) => void;
  setCurrentQuestion: (index: number) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<IQuizStore>()(
  persist(
    (set) => ({
      answers: {},
      currentQuestion: 0,
      setAnswer: (questionId, answer) => 
        set((state) => ({ 
          answers: { ...state.answers, [questionId]: answer } 
        })),
      setCurrentQuestion: (index) => set({ currentQuestion: index }),
      resetQuiz: () => set({ answers: {}, currentQuestion: 0 }),
    }),
    {
      name: 'quiz-storage', // localStorage에 저장될 키 이름
      partialize: (state) => ({ 
        answers: state.answers,
        currentQuestion: state.currentQuestion
      }),
    }
  )
);