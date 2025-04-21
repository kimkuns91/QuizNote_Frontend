'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { useTaskStore } from '@/store/taskStore';

/**
 * 글로벌 태스크 상태 체커 컴포넌트
 * 이 컴포넌트는 UI를 렌더링하지 않고 백그라운드에서 작동합니다.
 * 전역 상태 관리:
 * 1. 태스크 상태를 주기적으로 폴링
 * 2. 토스트 알림 표시
 * 3. 로컬 스토리지 복원 및 관리
 * 
 * 다른 컴포넌트들은 이 컴포넌트가 관리하는 Zustand 스토어를 구독하기만 하면 됩니다.
 */
export default function TaskStatusChecker() {
  const { taskId } = useTaskStore();
  const pathname = usePathname();
  
  // taskPolling 훅 사용 - 상태 확인 및 알림 처리
  // 이 컴포넌트에서만 useTaskPolling을 사용하고 다른 컴포넌트에서는 직접 사용하지 않도록 함
  useTaskPolling({
    showToasts: true,
    pollingInterval: 3000 // 3초마다 확인
  });
  
  // 로컬 스토리지에서 태스크 ID 복원
  useEffect(() => {
    // 첫 로드 시 로컬 스토리지에서 태스크 ID 확인 (페이지 새로고침 대응)
    const storedTaskId = localStorage.getItem('lectureTaskId');
    const storedLectureId = localStorage.getItem('lectureId');
    
    console.log('TaskStatusChecker - 로컬 스토리지 체크:', { storedTaskId, currentTaskId: taskId });
    
    // taskStore에 이미 taskId가 없고, 로컬 스토리지에 있으면 복원
    if (!taskId && storedTaskId) {
      try {
        const { startPolling } = useTaskStore.getState();
        startPolling(storedTaskId, storedLectureId || undefined);
        
        console.log('태스크 상태 추적 재개:', storedTaskId);
      } catch (error) {
        console.error('태스크 상태 복원 중 오류:', error);
      }
    }
  }, [taskId, pathname]); // 페이지가 변경될 때마다 확인
  
  return null; // UI를 렌더링하지 않음
} 