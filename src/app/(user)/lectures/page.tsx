'use client';

import { RiAddLine, RiDeleteBin6Line, RiEdit2Line, RiFileListLine } from 'react-icons/ri';
import { useCallback, useEffect, useRef } from 'react';
import { useDeleteLecture, useLectures } from '@/hooks/useLecture';

import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useModalStore } from '@/store/modalStore';
import { useRouter } from 'next/navigation';

export default function LecturesPage() {
  const router = useRouter();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useLectures();
  const { openModal } = useModalStore();
  const { mutate: deleteLecture } = useDeleteLecture();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastLectureRef = useRef<HTMLDivElement | null>(null);

  const handleCreateLecture = () => {
    openModal('fileUpload');
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (window.confirm('정말로 이 강의를 삭제하시겠습니까?')) {
      deleteLecture(lectureId);
    }
  };

  const handleViewLecture = (lectureId: string) => {
    router.push(`/lectures/${lectureId}`);
  };

  const handleEditLecture = (lectureId: string) => {
    router.push(`/lectures/${lectureId}/edit`);
  };

  // 무한 스크롤을 위한 Intersection Observer 설정
  const lastLectureCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) {
        observerRef.current.observe(node);
        lastLectureRef.current = node;
      }
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // 컴포넌트 언마운트 시 Observer 정리
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // 모든 강의 배열 추출
  const lectures = data?.pages.flatMap(page => page.data) || [];

  if (isLoading) {
    return (
      <div>
        {/* 헤더 영역 스켈레톤 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        {/* 강의 목록 스켈레톤 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex justify-between">
                <div className="flex items-center">
                  <Skeleton className="mr-2 h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              <div className="mb-4">
                <Skeleton className="h-4 w-48" />
              </div>

              <div className="mt-auto border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
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
            className="mt-4 rounded-md bg-accent px-4 py-2 text-white hover:bg-accent/80"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 영역 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">강의</h1>
          <p className="text-gray-500">모든 강의를 관리하고 학습하세요.</p>
        </div>
        <button
          onClick={handleCreateLecture}
          className="flex items-center rounded-md bg-accent px-4 py-2 text-white hover:bg-accent/80"
        >
          <RiAddLine className="mr-2" />
          새 강의 만들기
        </button>
      </div>

      {/* 강의 목록 */}
      {lectures && lectures.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lectures.map((lecture, index) => (
            <div
              key={lecture.id}
              ref={index === lectures.length - 1 ? lastLectureCallback : null}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex justify-between">
                <div className="flex items-center">
                  <RiFileListLine className="mr-2 text-blue-500" />
                  <h3 className="font-medium text-gray-800">{lecture.title}</h3>
                </div>
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
              </div>

              <div className="mb-4 flex-1">
                <p className="text-sm text-gray-500">
                  {lecture.mediaFile ? `오디오: ${lecture.mediaFile.fileName}` : '텍스트 강의'}
                </p>
              </div>

              <div className="mt-auto border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {format(new Date(lecture.updatedAt), 'PPP', { locale: ko })}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditLecture(lecture.id)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-500"
                    >
                      <RiEdit2Line />
                    </button>
                    <button
                      onClick={() => handleViewLecture(lecture.id)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-green-500"
                    >
                      <RiFileListLine />
                    </button>
                    <button
                      onClick={() => handleDeleteLecture(lecture.id)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-500"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <RiFileListLine className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-800">아직 강의가 없습니다</h3>
          <p className="mb-4 text-center text-sm text-gray-500">
            첫 번째 강의를 만들어 학습을 시작하세요.
          </p>
          <button
            onClick={handleCreateLecture}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            새 강의 만들기
          </button>
        </div>
      )}
      
      {/* 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <div className="mt-6 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

