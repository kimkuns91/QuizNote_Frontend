'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getQuiz } from '@/actions/quizActions';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { useQuizStore } from '@/store/quizStore';
import { useRouter } from 'next/navigation';
import { useSubmitQuizResult } from '@/hooks/useQuiz';

interface IQuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice';
  points: number;
  order: number;
  isAnswered: boolean;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    order: number;
  }[];
}

interface IQuiz {
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

interface PageProps {
  params: Promise<{
    quizId: string;
  }>;
}

export default function QuizPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const { quizId } = unwrappedParams;
  const router = useRouter();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Zustand 스토어 사용
  const { 
    answers, 
    currentQuestion, 
    setAnswer, 
    setCurrentQuestion, 
    resetQuiz 
  } = useQuizStore();
  
  const { mutate: submitQuiz, isPending } = useSubmitQuizResult();
  
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const result = await getQuiz(quizId);
        if (!result.success) {
          notFound();
        }
        setQuiz(result.data);
      } catch (error) {
        console.error('퀴즈 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
    
    // URL에 restart 파라미터가 있으면 퀴즈 상태 초기화
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('restart') === 'true') {
      resetQuiz();
    }
  }, [quizId, resetQuiz]);
  
  const handleAnswerSelect = (questionId: string, optionText: string) => {
    setAnswer(questionId, optionText);
  };
  
  const handleNextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmit = () => {
    if (!quiz) return;
    
    // 모든 문제에 답변했는지 확인
    const allQuestionsAnswered = quiz.questions.every(q => answers[q.id]);
    
    if (!allQuestionsAnswered) {
      alert('모든 문제에 답변해주세요.');
      return;
    }
    
    // 제출 형식으로 변환
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));
    
    submitQuiz(
      { quizId, answers: formattedAnswers },
      {
        onSuccess: () => {
          // 즉시 결과 페이지로 이동 (상태 초기화는 유지)
          router.push(`/quiz/${quizId}/result`);
        }
      }
    );
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loader"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-2">퀴즈를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground">요청하신 퀴즈가 존재하지 않거나 접근할 수 없습니다.</p>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/quiz')}
        >
          퀴즈 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  // 현재 인덱스가 유효한지 확인하고 범위를 조정
  if (currentQuestion >= quiz.questions.length) {
    setCurrentQuestion(0); // 범위를 벗어나면 첫 문제로 리셋
    return null; // 리렌더링을 위해 null 반환
  }

  const question = quiz.questions[currentQuestion];
  
  // question이 없는 경우 방어 처리
  if (!question) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-2">문제를 불러올 수 없습니다</h2>
        <p className="text-muted-foreground">퀴즈 데이터에 문제가 있습니다.</p>
        <Button 
          className="mt-4" 
          onClick={() => resetQuiz()}
        >
          퀴즈 초기화
        </Button>
      </div>
    );
  }
  
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">{quiz.title}</CardTitle>
                <CardDescription className="text-gray-100 mt-1">{quiz.description}</CardDescription>
              </div>
              <div className="bg-white text-indigo-600 rounded-full px-3 py-1 text-sm font-medium">
                {currentQuestion + 1} / {totalQuestions}
              </div>
            </div>
          </CardHeader>
          
          {/* 진행 상태 표시 */}
          <div className="h-1 w-full bg-gray-200">
            <motion.div 
              className="h-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-6">
              {question.question}
            </h3>
            
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.text;
                
                return (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(question.id, option.text)}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="mr-3">
                      {isSelected ? (
                        <CheckCircle className="h-6 w-6 text-indigo-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`${isSelected ? 'font-medium' : ''}`}>
                        {option.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-4 pb-6">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
            >
              이전
            </Button>
            
            {currentQuestion === totalQuestions - 1 ? (
              <Button 
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isPending ? '제출 중...' : '제출하기'}
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={!answers[question.id]}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                다음
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

