'use client';

import { RiArrowLeftLine, RiFileListLine, RiQuestionLine } from 'react-icons/ri';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useLecture } from '@/hooks/useLecture';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';

export default function LecturePage() {
  const router = useRouter();
  const { lectureId } = useParams<{ lectureId: string }>();
  const { data: lecture, isLoading, isError } = useLecture(lectureId);

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
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <RiArrowLeftLine className="mr-2 h-5 w-5" />
          뒤로 가기
        </button>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">{lecture.title}</h1>
        {lecture.description && (
          <p className="mb-4 text-gray-600">{lecture.description}</p>
        )}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>
            생성일: {format(new Date(lecture.createdAt), 'PPP', { locale: ko })}
          </span>
          <span>
            수정일: {format(new Date(lecture.updatedAt), 'PPP', { locale: ko })}
          </span>
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
      </div>

      {/* 미디어 파일 정보 */}
      {lecture.mediaFile && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">미디어 파일</h2>
          <div className="space-y-2">
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
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">강의 노트</h2>
          {lecture.lectureNote ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                마지막 수정: {format(new Date(lecture.lectureNote.updatedAt), 'PPP', { locale: ko })}
              </p>
              <button
                onClick={() => router.push(`/notes/${lecture.lectureNote?.id}`)}
                className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <RiFileListLine className="mr-2 h-5 w-5" />
                노트 보기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">아직 생성된 강의 노트가 없습니다.</p>
              <button
                onClick={() => router.push(`/notes/new?lectureId=${lecture.id}`)}
                className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <RiFileListLine className="mr-2 h-5 w-5" />
                노트 생성하기
              </button>
            </div>
          )}
        </div>

        {/* 퀴즈 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">퀴즈</h2>
          {lecture.quiz ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-medium">난이도:</span>{' '}
                {lecture.quiz.difficulty === 'easy' && '쉬움'}
                {lecture.quiz.difficulty === 'medium' && '보통'}
                {lecture.quiz.difficulty === 'hard' && '어려움'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">문제 수:</span> {lecture.quiz.questions.length}개
              </p>
              <button
                onClick={() => router.push(`/quiz/${lecture.quiz?.id}`)}
                className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <RiQuestionLine className="mr-2 h-5 w-5" />
                퀴즈 풀기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">아직 생성된 퀴즈가 없습니다.</p>
              <button
                onClick={() => router.push(`/quiz/new?lectureId=${lecture.id}`)}
                className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <RiQuestionLine className="mr-2 h-5 w-5" />
                퀴즈 생성하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

