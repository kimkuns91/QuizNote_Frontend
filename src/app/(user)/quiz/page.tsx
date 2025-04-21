'use client';

import React, { useState } from 'react';
import {
  RiBookmarkLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimeLine
} from 'react-icons/ri';

import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useQuizzes } from '@/hooks/useQuiz';
import { useRouter } from 'next/navigation';

// 애니메이션 변수
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function QuizPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const { data: quizzes, isLoading, isError } = useQuizzes();

  const handleQuizClick = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  const filteredQuizzes = quizzes?.filter((quiz) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return quiz.questions.every(q => q.isAnswered);
    if (activeTab === 'incomplete') return quiz.questions.some(q => !q.isAnswered);
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* 헤더 스켈레톤 */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex overflow-hidden rounded-md border border-gray-200 bg-white">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>

        {/* 통계 상자 스켈레톤 */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-indigo-50 p-4 text-center">
              <Skeleton className="mx-auto mb-2 h-4 w-24" />
              <Skeleton className="mx-auto h-8 w-16" />
            </div>
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <Skeleton className="mx-auto mb-2 h-4 w-24" />
              <Skeleton className="mx-auto h-8 w-16" />
            </div>
            <div className="rounded-lg bg-orange-50 p-4 text-center">
              <Skeleton className="mx-auto mb-2 h-4 w-24" />
              <Skeleton className="mx-auto h-8 w-16" />
            </div>
          </div>
        </div>
        
        {/* 퀴즈 카드 스켈레톤 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="mt-1 h-4 w-full" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div 
        className="flex h-96 items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div 
            className="mb-4 flex justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </motion.div>
          <p className="text-red-600">퀴즈를 불러오는데 실패했습니다.</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            다시 시도
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">퀴즈</h1>
        <div className="flex overflow-hidden rounded-md border border-gray-200 bg-white">
          {[
            { id: 'all', label: '전체' },
            { id: 'completed', label: '완료' },
            { id: 'incomplete', label: '미완료' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              whileHover={activeTab !== tab.id ? { backgroundColor: "rgb(249 250 251)" } : {}}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <motion.div 
            className="rounded-lg bg-indigo-50 p-4 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-sm font-medium text-gray-700">전체 퀴즈</p>
            <p className="text-3xl font-bold text-indigo-600">{quizzes?.length || 0}개</p>
          </motion.div>
          <motion.div 
            className="rounded-lg bg-green-50 p-4 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-sm font-medium text-gray-700">완료한 퀴즈</p>
            <p className="text-3xl font-bold text-green-600">
              {quizzes?.filter(q => q.questions.every(q => q.isAnswered)).length || 0}개
            </p>
          </motion.div>
          <motion.div 
            className="rounded-lg bg-orange-50 p-4 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-sm font-medium text-gray-700">평균 점수</p>
            <p className="text-3xl font-bold text-orange-600">
              {Math.round(
                (quizzes?.reduce((acc, q) => acc + (q.score || 0), 0) || 0) /
                  (quizzes?.length || 1)
              ) || 0}
              점
            </p>
          </motion.div>
        </div>
      </motion.div>
              
      <motion.div 
        className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredQuizzes?.map((quiz) => (
          <motion.div
            key={quiz.id}
            variants={item}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer"
            onClick={() => handleQuizClick(quiz.id)}
            whileHover={{ 
              scale: 1.02, 
              y: -5, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-indigo-600">{quiz.title}</h3>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {quiz.difficulty}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{quiz.description}</p>
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <RiBookmarkLine className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">문제 수: {quiz.questions.length}개</span>
                </div>
                <div className="flex items-center text-sm">
                  <RiTimeLine className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {quiz.questions.every(q => q.isAnswered) ? '완료' : '미완료'}
                  </span>
                </div>
                {quiz.score !== undefined && (
                  <div className="flex items-center text-sm">
                    {quiz.score >= 80 ? (
                      <RiCheckboxCircleLine className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <RiCloseCircleLine className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium text-gray-700">점수: {quiz.score}점</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                {quiz.questions.every(q => q.isAnswered) ? (
                  <>
                    <motion.button 
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/quiz/${quiz.id}/result`);
                      }}
                    >
                      결과 확인
                    </motion.button>
                    <motion.button 
                      className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/quiz/${quiz.id}?restart=true`);
                      }}
                    >
                      다시 풀기
                    </motion.button>
                  </>
                ) : (
                  <motion.button 
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    시작하기
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredQuizzes?.length === 0 && (
        <motion.div 
          className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-500">해당하는 퀴즈가 없습니다.</p>
          <motion.button 
            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            새 퀴즈 생성하기
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
