'use client';

import { FaArrowLeft, FaHome } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  // 이전 페이지로 이동하는 함수
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <div className="mx-auto max-w-md">
        {/* 404 텍스트 */}
        <h1 className="mb-2 text-9xl font-extrabold text-primary">404</h1>

        {/* 메인 메시지 */}
        <h2 className="mb-6 text-3xl font-bold text-foreground">페이지를 찾을 수 없습니다</h2>

        {/* 부가 설명 */}
        <p className="mb-8 text-base font-medium text-muted-foreground">
          요청하신 페이지가 삭제되었거나, 이름이 변경되었거나, 일시적으로 사용이 중단되었습니다.
        </p>

        {/* 일러스트레이션 */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-48 w-48">
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl">📚</span>
            </div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Button
            asChild
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg sm:w-auto"
          >
            <Link href="/">
              <FaHome className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-border bg-card px-6 font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md sm:w-auto"
            onClick={goBack}
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            이전 페이지로
          </Button>
        </div>
      </div>
    </div>
  );
}
