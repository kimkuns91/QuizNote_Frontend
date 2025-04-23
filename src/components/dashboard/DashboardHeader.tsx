'use client';

import React, { useEffect, useRef, useState } from 'react';

import HeaderAuthSection from '@/components/layout/HeaderAuthSection';
import { ISearchResult } from '@/components/dashboard/SearchResults';
import { RiBellLine } from 'react-icons/ri';
import Search from '@/components/dashboard/Search';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/store/taskStore';

// import TaskStatusTracker from '@/components/TaskStatusTracker';


const DashboardHeader = () => {
  // useTaskPolling 대신 직접 useTaskStore 사용
  const { taskId, taskStatus, isPolling } = useTaskStore();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // 상태 변경 로깅
  useEffect(() => {
    console.log('DashboardHeader - 태스크 상태:', { taskId, taskStatus, isPolling });
  }, [taskId, taskStatus, isPolling]);
  
  // 알림 패널 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 알림 아이콘 상태에 따라 색상 변경
  const getBellIconStatus = () => {
    if (!taskId) return "bg-gray-100 text-gray-600 hover:bg-gray-200";
    
    switch (taskStatus) {
      case 'PENDING':
        return "bg-yellow-100 text-yellow-600 hover:bg-yellow-200";
      case 'STARTED':
        return "bg-blue-100 text-blue-600 hover:bg-blue-200";
      case 'SUCCESS':
        return "bg-green-100 text-green-600 hover:bg-green-200";
      case 'FAILURE':
        return "bg-red-100 text-red-600 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-200";
    }
  };
  
  // 검색 처리 함수
  const handleSearch = (query: string) => {
    console.log('검색어:', query);
    // 검색 API 호출 또는 다른 로직을 추가할 수 있음
  };
  
  // 검색 결과 클릭 처리
  const handleSearchResultClick = (result: ISearchResult) => {
    console.log('검색 결과 클릭:', result);
    // 클릭된 결과에 따라 페이지 이동
    if (result.path) {
      router.push(result.path);
    }
  };
  
  return (
    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <Search 
            onSearch={handleSearch} 
            onResultClick={handleSearchResultClick}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button 
              className={`relative rounded-full p-2 transition-colors ${getBellIconStatus()}`}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <RiBellLine className="h-5 w-5" />
              {taskId && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[8px] font-bold text-white">
                  1
                </span>
              )}
            </button>
            
            {/* 알림 드롭다운 */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 z-30 origin-top-right">
                {/* {taskId ? (
                  <TaskStatusTracker />
                ) : (
                  <div className="rounded-lg bg-white shadow-lg border border-gray-200 p-4">
                    <div className="text-center text-gray-500">
                      <p>진행 중인 작업이 없습니다.</p>
                    </div>
                  </div>
                )} */}
              </div>
            )}
          </div>
          
          <HeaderAuthSection/>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;