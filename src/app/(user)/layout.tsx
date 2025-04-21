import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { ModalProvider } from '@/components/modals/ModalProvider';
import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* 사이드바 컴포넌트 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto pl-60">
        {/* 상단 헤더 - 고정 */}
        <DashboardHeader />

        {/* 콘텐츠 영역 */}
        <div className="ml-2 rounded-tl-xl bg-muted/50 p-8 min-h-[calc(100vh-64px)] inset-shadow-sm inset-shadow-zinc-300">{children}</div>
      </main>

      {/* 모달 프로바이더 */}
      <ModalProvider />
    </div>
  );
}
