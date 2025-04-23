'use client';

import { RiArrowLeftLine, RiDeleteBin6Line, RiEdit2Line, RiFileListLine, RiQuestionLine } from 'react-icons/ri';
import { useDeleteLecture, useLecture } from '@/hooks/useLecture';
import { useParams, useRouter } from 'next/navigation';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function LecturePage() {
  const router = useRouter();
  const { lectureId } = useParams<{ lectureId: string }>();
  const { data: lecture, isLoading, isError } = useLecture(lectureId);
  const { mutate: deleteLecture } = useDeleteLecture();

  const handleDeleteLecture = async () => {
    if (window.confirm('정말로 이 강의를 삭제하시겠습니까?')) {
      deleteLecture(lectureId as string);
      router.push('/lectures');
    }
  };

  const handleEditLecture = () => {
    router.push(`/lectures/${lectureId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-blue-500"></div>
          <p className="text-gray-600">강의를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !lecture) {
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
            onClick={() => router.back()}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <RiArrowLeftLine className="mr-2 h-5 w-5" />
            뒤로 가기
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditLecture}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-500"
              aria-label="강의 수정"
            >
              <RiEdit2Line size={18} />
            </button>
            <button
              onClick={handleDeleteLecture}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500"
              aria-label="강의 삭제"
            >
              <RiDeleteBin6Line size={18} />
            </button>
          </div>
        </div>
        <div className="border-l-4 border-l-blue-500 bg-white pl-4 py-3">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">{lecture.title}</h1>
          {lecture.description && (
            <p className="mb-4 text-gray-600">{lecture.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <span>
              생성일: {format(new Date(lecture.createdAt), 'PPP', { locale: ko })}
            </span>
            <span>
              수정일: {format(new Date(lecture.updatedAt), 'PPP', { locale: ko })}
            </span>
            <span className={`
              rounded-full px-2 py-0.5 text-xs font-medium
              ${lecture.processingStatus === 'completed' ? 'bg-green-50 text-green-600' : ''}
              ${lecture.processingStatus === 'processing' ? 'bg-yellow-50 text-yellow-600' : ''}
              ${lecture.processingStatus === 'failed' ? 'bg-red-50 text-red-600' : ''}
            `}>
              {lecture.processingStatus === 'completed' && '완료'}
              {lecture.processingStatus === 'processing' && '처리 중'}
              {lecture.processingStatus === 'failed' && '실패'}
            </span>
          </div>
        </div>
      </div>

      {/* 미디어 파일 정보 */}
      {lecture.mediaFile && (
        <div className="mb-8 rounded-lg border-l-4 border-l-blue-200 border-r border-t border-b border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">미디어 파일</h2>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">파일명:</span> {lecture.mediaFile.fileName}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">파일 크기:</span>{' '}
              {(lecture.mediaFile.fileSize / (1024 * 1024)).toFixed(2)} MB
            </p>
            <p className="text-gray-600">
              <span className="font-medium">파일 형식:</span> {lecture.mediaFile.fileType}
            </p>
            {lecture.mediaFile.duration && (
              <p className="text-gray-600">
                <span className="font-medium">재생 시간:</span>{' '}
                {Math.floor(lecture.mediaFile.duration / 60)}분{' '}
                {Math.floor(lecture.mediaFile.duration % 60)}초
              </p>
            )}
          </div>
        </div>
      )}

      {/* 강의 노트와 퀴즈 섹션 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 강의 노트 */}
        <div className="rounded-lg border-l-4 border-l-green-400 border-r border-t border-b border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">강의 노트</h2>
          {lecture.lectureNote ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                마지막 수정: {format(new Date(lecture.lectureNote.updatedAt), 'PPP', { locale: ko })}
              </p>
              <button
                onClick={() => router.push(`/notes/${lecture.lectureNote?.id}`)}
                className="flex items-center rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
              >
                <RiFileListLine className="mr-2 h-4 w-4" />
                노트 보기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">아직 생성된 강의 노트가 없습니다.</p>
              <button
                onClick={() => router.push(`/notes/new?lectureId=${lecture.id}`)}
                className="flex items-center rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
              >
                <RiFileListLine className="mr-2 h-4 w-4" />
                노트 생성하기
              </button>
            </div>
          )}
        </div>

        {/* 퀴즈 */}
        <div className="rounded-lg border-l-4 border-l-amber-400 border-r border-t border-b border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">퀴즈</h2>
          {lecture.quiz ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">난이도:</span>{' '}
                  {lecture.quiz.difficulty === 'easy' && '쉬움'}
                  {lecture.quiz.difficulty === 'medium' && '보통'}
                  {lecture.quiz.difficulty === 'hard' && '어려움'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">문제 수:</span> {lecture.quiz.questions.length}개
                </p>
              </div>
              <button
                onClick={() => router.push(`/quiz/${lecture.quiz?.id}`)}
                className="flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
              >
                <RiQuestionLine className="mr-2 h-4 w-4" />
                퀴즈 풀기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">아직 생성된 퀴즈가 없습니다.</p>
              <button
                onClick={() => router.push(`/quiz/new?lectureId=${lecture.id}`)}
                className="flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
              >
                <RiQuestionLine className="mr-2 h-4 w-4" />
                퀴즈 생성하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

