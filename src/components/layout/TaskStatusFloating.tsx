'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { useTaskStore } from '@/store/taskStore';

// import TaskStatusTracker from '@/components/TaskStatusTracker';


export default function TaskStatusFloating() {
  const { taskId, taskStatus, isPolling } = useTaskStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // 초기 로드 시 태스크 ID가 있는지 확인
  useEffect(() => {
    if (taskId && isPolling) {
      setIsVisible(true);
      setIsMinimized(false); // 새 태스크가 시작되면 최대화
    } else {
      // 태스크가 없거나 폴링이 중지되면 5초 후 숨기기
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [taskId, isPolling]);
  
  // 성공 완료 시 처리
  useEffect(() => {
    if (taskStatus === 'SUCCESS') {
      // 완료되면 5초 후 최소화
      const timer = setTimeout(() => setIsMinimized(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [taskStatus]);
  
  // 태스크가 없으면 아무것도 표시하지 않음
  if (!isVisible) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        {isMinimized ? (
          // 최소화된 버튼
          <motion.button
            className="flex items-center space-x-2 rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg hover:bg-blue-700"
            onClick={() => setIsMinimized(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
            <span>처리 중...</span>
          </motion.button>
        ) : (
          // 전체 트래커
          <div className="relative w-80 md:w-96">
            <button
              onClick={() => setIsMinimized(true)}
              className="absolute -right-1 -top-1 z-10 rounded-full bg-gray-200 p-1 text-gray-500 hover:bg-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 9a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            {/* <TaskStatusTracker /> */}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
} 