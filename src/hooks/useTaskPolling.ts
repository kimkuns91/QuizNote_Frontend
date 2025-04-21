'use client';

import { useEffect, useRef } from 'react';

import { toast } from 'react-hot-toast';
import { useTaskStore } from '@/store/taskStore';

export function useTaskPolling(options?: { 
  onSuccess?: () => void,
  onFailure?: () => void,
  onError?: (error: Error) => void,
  pollingInterval?: number,
  showToasts?: boolean
}) {
  const { 
    taskId, 
    taskStatus, 
    isPolling, 
    checkTaskStatus,
    stopPolling
  } = useTaskStore();

  // 이전 상태를 추적하기 위한 ref
  const prevStatusRef = useRef(taskStatus);
  
  const interval = options?.pollingInterval || 3000; // 기본 3초
  const showToasts = options?.showToasts !== false; // 기본값은 true

  // 초기화 로그 (최초 한 번만 출력)
  useEffect(() => {
    console.log('useTaskPolling 초기화 - 옵션:', {
      pollingInterval: options?.pollingInterval,
      showToasts: options?.showToasts
    });
    console.log('useTaskPolling 현재 상태:', { taskId, taskStatus, isPolling });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 상태가 변경되었을 때만 토스트 표시
    if (prevStatusRef.current !== taskStatus && showToasts) {
      // 상태 변경 시에만 로그 출력 (STARTED의 반복 출력 방지)
      console.log('태스크 상태 변경:', prevStatusRef.current, '->', taskStatus);
      
      if (taskStatus === 'SUCCESS') {
        console.log('성공 토스트 표시');
        toast.success('변환이 완료되었습니다!', {
          duration: 5000,
          icon: '✅',
        });
        
        if (options?.onSuccess) {
          options.onSuccess();
        }
      } else if (taskStatus === 'FAILURE') {
        console.log('실패 토스트 표시');
        toast.error('변환 작업이 실패했습니다. 다시 시도해주세요.', {
          duration: 5000,
        });
        
        if (options?.onFailure) {
          options.onFailure();
        }
      } else if (taskStatus === 'STARTED' && prevStatusRef.current === 'PENDING') {
        console.log('시작 토스트 표시');
        toast('변환 작업이 시작되었습니다.', {
          icon: '⚙️',
          duration: 3000,
        });
      }
    }
    
    // 현재 상태를 이전 상태로 업데이트
    prevStatusRef.current = taskStatus;
  }, [taskStatus, options, showToasts]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    let pollingCount = 0; // 폴링 횟수 추적
    
    if (taskId && isPolling) {
      console.log('폴링 시작 - 간격:', interval, 'ms');
      
      // 즉시 한 번 상태 확인
      checkTaskStatusWithErrorHandling();
      
      // 주기적으로 상태 확인
      intervalId = setInterval(async () => {
        // 로그 폭주 방지를 위해 10회마다 한 번씩만 로그 출력
        pollingCount++;
        if (pollingCount % 10 === 0) {
          console.log(`폴링 계속 중 (${pollingCount}회)`);
        }
        
        await checkTaskStatusWithErrorHandling();
        
        // 완료되거나 실패한 경우, 일정 시간 후 polling 중지
        const currentStatus = useTaskStore.getState().taskStatus;
        if (['SUCCESS', 'FAILURE'].includes(currentStatus || '')) {
          console.log('태스크 완료/실패, 30초 후 폴링 중지 예약');
          setTimeout(() => {
            console.log('예약된 폴링 중지 실행');
            useTaskStore.getState().setIsPolling(false);
          }, 30000); // 30초 후 polling 중지
        }
      }, interval);
    } else if (!isPolling) {
      console.log('폴링 중지 - 이유: isPolling이 false');
    } else if (!taskId) {
      console.log('폴링 중지 - 이유: taskId가 null');
    }
    
    // 오류 처리를 포함한 체크 함수
    async function checkTaskStatusWithErrorHandling() {
      try {
        await checkTaskStatus();
      } catch (error) {
        console.error('태스크 상태 체크 중 오류:', error);
        if (options?.onError && error instanceof Error) {
          options.onError(error);
        }
      }
    }
    
    return () => {
      if (intervalId) {
        console.log('인터벌 클리어');
        clearInterval(intervalId);
      }
    };
  }, [taskId, isPolling, interval, checkTaskStatus, options]);
  
  // 컴포넌트 언마운트 시 메모리 누수 방지
  useEffect(() => {
    return () => {
      if (isPolling) {
        console.log('컴포넌트 언마운트 시 폴링 유지');
        // 언마운트 시 폴링 중지하지 않고 유지
      }
    };
  }, [isPolling]);
  
  return {
    taskId,
    taskStatus,
    isPolling,
    stopPolling,
  };
} 