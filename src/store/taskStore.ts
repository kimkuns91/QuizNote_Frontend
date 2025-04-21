'use client';

import { create } from 'zustand';
import { getTaskStatus } from '@/actions/lectureActions';
import { persist } from 'zustand/middleware';

export type TaskStatus = 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | null;

interface TaskState {
  taskId: string | null;
  lectureId: string | null;
  taskStatus: TaskStatus;
  isPolling: boolean;
  error: Error | null;
  
  // 액션
  setTaskId: (taskId: string | null) => void;
  setLectureId: (lectureId: string | null) => void;
  setTaskStatus: (status: TaskStatus) => void;
  setIsPolling: (isPolling: boolean) => void;
  setError: (error: Error | null) => void;
  startPolling: (taskId: string, lectureId?: string) => void;
  stopPolling: () => void;
  checkTaskStatus: () => Promise<void>;
  reset: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      taskId: null,
      lectureId: null,
      taskStatus: null,
      isPolling: false,
      error: null,
      
      setTaskId: (taskId) => {
        console.log('태스크 ID 설정:', taskId);
        set({ taskId });
      },
      setLectureId: (lectureId) => set({ lectureId }),
      setTaskStatus: (taskStatus) => set({ taskStatus }),
      setIsPolling: (isPolling) => set({ isPolling }),
      setError: (error) => set({ error }),
      
      startPolling: (taskId, lectureId) => {
        console.log('폴링 시작:', taskId, lectureId);
        
        // 현재 상태 로깅
        const currentState = get();
        console.log('폴링 시작 전 상태:', currentState);
        
        // 상태 업데이트
        set({ 
          taskId, 
          lectureId: lectureId || null,
          isPolling: true,
          taskStatus: null, // 초기화
          error: null // 오류 초기화
        });
        
        // 상태 업데이트 확인
        const newState = get();
        console.log('폴링 시작 후 상태:', newState);
      },
      
      stopPolling: () => {
        console.log('폴링 중지');
        set({ isPolling: false });
      },
      
      checkTaskStatus: async () => {
        const { taskId } = get();
        if (!taskId) {
          console.log('태스크 ID 없음, 상태 확인 생략');
          return;
        }
        
        try {
          const result = await getTaskStatus(taskId);
          if (result.success && result.data) {
            // 간소화된 로그 출력
            const statusData = {
              task_id: result.data.task_id,
              status: result.data.status,
              error: result.data.error
            };
            console.log('태스크 상태 확인:', statusData);
            
            set({ 
              taskStatus: result.data.status as TaskStatus,
              error: null // 성공 시 오류 초기화
            });
            
            // 작업이 완료되면 폴링 중지
            if (['SUCCESS', 'FAILURE'].includes(result.data.status)) {
              set({ isPolling: false });
            }
          } else {
            console.error('태스크 상태 확인 실패:', result.error);
            // 서버 오류 처리
            const error = new Error(result.error || '태스크 상태 확인 실패');
            set({ error });
            throw error;
          }
        } catch (error) {
          console.error('태스크 상태 확인 중 오류:', error);
          // 오류 상태 설정
          set({ error: error instanceof Error ? error : new Error('알 수 없는 오류') });
          throw error;
        }
      },
      
      reset: () => {
        console.log('태스크 상태 초기화');
        set({ 
          taskId: null, 
          lectureId: null, 
          taskStatus: null, 
          isPolling: false,
          error: null
        });
      },
    }),
    {
      name: 'task-storage', // 로컬 스토리지 키 이름
      onRehydrateStorage: (state) => {
        console.log('태스크 스토어 리하이드레이션:', state);
      }
    }
  )
); 