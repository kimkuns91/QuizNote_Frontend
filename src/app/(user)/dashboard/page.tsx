'use client';

import { RiArrowDownLine, RiDeleteBin6Line, RiEdit2Line, RiFileListLine } from 'react-icons/ri';
import { useDeleteLecture, useLectures } from '@/hooks/useLecture';

import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useModalStore } from '@/store/modalStore';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

// 애니메이션 변수
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  const { openModal } = useModalStore();
  const router = useRouter();
  const { data, isLoading, isError } = useLectures();
  const { mutate: deleteLecture } = useDeleteLecture();
  const [showAll, setShowAll] = useState(false);
  const { data: session } = useSession();
  
  // 초기에 보여줄 강의 개수
  const INITIAL_DISPLAY_COUNT = 5;
  
  // 모든 강의 데이터 추출
  const lectures = data?.pages.flatMap(page => page.data) || [];
  
  // 보여줄 강의 목록 계산
  const visibleLectures = showAll ? lectures : lectures.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreLectures = lectures.length > INITIAL_DISPLAY_COUNT;

  const handleFileUploadClick = () => {
    openModal('fileUpload');
  };

  // const handleUrlUploadClick = () => {
  //   openModal('urlUpload');
  // };

  const handleDeleteLecture = (lectureId: string) => {
    if (window.confirm('정말로 이 강의를 삭제하시겠습니까?')) {
      deleteLecture(lectureId);
    }
  };

  const handleEditLecture = (lectureId: string) => {
    router.push(`/lectures/${lectureId}/edit`);
  };

  const handleViewLecture = (lectureId: string) => {
    router.push(`/lectures/${lectureId}`);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (isLoading) {
    return (
      <div>
        {/* 환영 섹션 스켈레톤 */}
        <div className="mb-8 flex items-center justify-between">
          <div className="w-full">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>

        {/* 기능 카드 스켈레톤 */}
        <div className="mb-12 grid grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>

        {/* 내 강의 섹션 스켈레톤 */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>

          {/* 강의 목록 스켈레톤 */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="bg-gray-50 p-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="divide-y divide-gray-200 bg-white">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-32" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 무료 플랜 정보 스켈레톤 */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <Skeleton className="mb-4 h-6 w-80" />
          <div className="mb-4 space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
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
          </div>
          <p className="text-red-600">강의를 불러오는데 실패했습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      {/* 환영 섹션 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">안녕하세요, {session?.user?.name} 님</h1>
          <p className="text-gray-500">AI가 정리한 강의 요약과 맞춤형 퀴즈로 학습 효율을 높이세요. 🚀</p>
        </div>
      </motion.div>

      {/* 기능 카드 */}
      <motion.div 
        className="mb-12 grid grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {[
          {
            icon: RiFileListLine,
            title: '파일 업로드',
            color: 'bg-green-50 text-green-600',
            onClick: handleFileUploadClick,
          },
          // {
          //   icon: RiYoutubeLine,
          //   title: '유튜브 URL 입력',
          //   color: 'bg-red-50 text-red-600',
          //   onClick: handleUrlUploadClick,
          // },
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex cursor-pointer flex-col items-center rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            onClick={item.onClick}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}
            >
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="text-center text-sm font-medium text-gray-700">{item.title}</h3>
          </motion.div>
        ))}
      </motion.div>

      {/* 내 강의 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">내 강의</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="appearance-none rounded-md border border-gray-300 bg-white px-3 py-1 pr-8 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none">
                <option>모든 항목</option>
                <option>최근 항목</option>
                <option>처리 중</option>
                <option>완료</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 강의 목록 */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  제목
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  상태
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  업데이트 날짜
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {visibleLectures?.map((lecture, index) => (
                <motion.tr 
                  key={lecture.id} 
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{lecture.title}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {lecture.processingStatus === 'completed' && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                        완료
                      </span>
                    )}
                    {lecture.processingStatus === 'processing' && (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        처리 중
                      </span>
                    )}
                    {lecture.processingStatus === 'failed' && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                        실패
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {format(new Date(lecture.updatedAt), 'PPP', { locale: ko })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        onClick={() => handleViewLecture(lecture.id)}
                        className="text-blue-600 hover:text-blue-900"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <RiFileListLine className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleEditLecture(lecture.id)}
                        className="text-gray-600 hover:text-gray-900"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <RiEdit2Line className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteLecture(lecture.id)}
                        className="text-red-600 hover:text-red-900"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <RiDeleteBin6Line className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {/* 더 보기 버튼 */}
          {hasMoreLectures && (
            <div className="flex justify-center border-t border-gray-200 bg-gray-50 p-2">
              <motion.button
                onClick={toggleShowAll}
                className="flex items-center space-x-1 rounded-md px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{showAll ? '접기' : '더 보기'}</span>
                <motion.div
                  animate={{ rotate: showAll ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RiArrowDownLine className="h-4 w-4" />
                </motion.div>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* 무료 플랜 정보 */}
      <motion.div 
        className="mt-8 rounded-lg bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="mb-2 text-lg font-semibold">더 많은 작업 완료하기 위해 Pro 플랜을 업그레이드하세요:</h3>
        <ul className="mb-4 space-y-2">
          <li className="flex items-center text-sm text-gray-600">
            <span className="mr-2 text-green-500">✓</span> AI 노트
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <span className="mr-2 text-green-500">✓</span> 녹음 및 전사 내보내기
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <span className="mr-2 text-green-500">✓</span> 자막 번역
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <span className="mr-2 text-green-500">✓</span> 1회 당 1.5시간의 녹음 가능
          </li>
        </ul>
        <div className="flex justify-center">
          <motion.button 
            className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎁 오늘 업그레이드하고 10% 할인 받기
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}