'use client';

import { ArrowLeft, Award, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuiz, getQuizResult } from '@/actions/quizActions';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { use } from 'react';
import { useRouter } from 'next/navigation';

interface IQuizAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
}

interface IQuizResult {
  id: string;
  score: number;
  totalPoints: number;
  completedAt: Date;
  answers: IQuizAnswer[];
}

interface IQuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice';
  points: number;
  order: number;
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
  createdAt: Date;
  updatedAt: Date;
  questions: IQuizQuestion[];
}

interface PageProps {
  params: Promise<{
    quizId: string;
  }>;
}

export default function QuizResultPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const { quizId } = unwrappedParams;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [result, setResult] = useState<IQuizResult | null>(null);
  
  useEffect(() => {
    const fetchQuizAndResults = async () => {
      try {
        // 퀴즈 정보 가져오기
        const quizResult = await getQuiz(quizId);
        if (!quizResult.success) {
          notFound();
        }
        setQuiz(quizResult.data);
        
        // DB에서 결과 정보 가져오기
        const resultData = await getQuizResult(quizId);
        if (!resultData.success) {
          toast.error('퀴즈 결과를 찾을 수 없습니다');
          router.push(`/quiz/${quizId}`);
          return;
        }
        
        setResult(resultData.data);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizAndResults();
  }, [quizId, router]);

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loader"></div>
      </div>
    );
  }

  if (!quiz || !result) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-2">결과를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground">퀴즈 결과가 존재하지 않거나 접근할 수 없습니다.</p>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/quiz')}
        >
          퀴즈 목록으로 돌아가기
        </Button>
      </div>
    );
  }
  
  // 점수 비율 계산
  const scorePercentage = (result.score / result.totalPoints) * 100;
  
  // 결과 색상 결정
  let resultColor = 'text-red-600';
  let resultBgColor = 'from-red-500 to-red-600';
  if (scorePercentage >= 70) {
    resultColor = 'text-green-600';
    resultBgColor = 'from-green-500 to-emerald-600';
  } else if (scorePercentage >= 50) {
    resultColor = 'text-yellow-600';
    resultBgColor = 'from-yellow-500 to-amber-600';
  }
  
  // 결과 메시지 결정
  let resultMessage = '더 노력해보세요!';
  if (scorePercentage >= 70) {
    resultMessage = '훌륭한 성과입니다!';
  } else if (scorePercentage >= 50) {
    resultMessage = '잘 했습니다!';
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="flex items-center text-gray-600"
            onClick={() => router.push('/quiz')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            퀴즈 목록으로 돌아가기
          </Button>
        </div>
        
        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className={`bg-gradient-to-r ${resultBgColor} text-white`}>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">{quiz.title} - 결과</CardTitle>
                <CardDescription className="text-gray-100 mt-1">{quiz.description}</CardDescription>
              </div>
              <Award className="h-10 w-10 text-white opacity-80" />
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="text-center mb-4 md:mb-0">
                <h3 className="text-2xl font-bold mb-1">최종 점수</h3>
                <div className={`text-4xl font-bold ${resultColor}`}>
                  {result.score} / {result.totalPoints}
                </div>
                <p className="text-gray-500 mt-1">
                  ({Math.round(scorePercentage)}%)
                </p>
              </div>
              
              <div className="text-center">
                <div className={`text-xl font-bold ${resultColor} mb-2`}>
                  {resultMessage}
                </div>
                <p className="text-gray-500">
                  {new Date(result.completedAt).toLocaleString('ko-KR')}에 완료
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">문제별 결과</h3>
            
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const userAnswer = result.answers.find(a => a.questionId === question.id);
                const correctOption = question.options.find(opt => opt.isCorrect);
                
                return (
                  <div 
                    key={question.id} 
                    className={`p-4 rounded-lg border ${
                      userAnswer?.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 pt-1">
                        {userAnswer?.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">
                          {index + 1}. {question.question}
                        </h4>
                        
                        <div className="ml-1 space-y-1 text-sm">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">내 답변:</span>
                            <span className={userAnswer?.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {userAnswer?.answer || '응답 없음'}
                            </span>
                          </div>
                          
                          {!userAnswer?.isCorrect && (
                            <div className="flex items-center">
                              <span className="font-medium mr-2">정답:</span>
                              <span className="text-green-600">
                                {correctOption?.text || '정답 정보 없음'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          
          <CardFooter className="p-6 pt-0 flex justify-center">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 mr-2"
              onClick={() => router.push(`/quiz/${quizId}`)}
            >
              다시 풀기
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/quiz')}
            >
              퀴즈 목록
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
} 