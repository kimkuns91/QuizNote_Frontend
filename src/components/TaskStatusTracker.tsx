'use client';

import React, { useEffect } from 'react';
import { RiCheckLine, RiCloseCircleLine, RiLoader4Line, RiTimeLine } from 'react-icons/ri';

import { useTaskStore } from '@/store/taskStore';

// 태스크 상태에 따른 아이콘 및 텍스트 색상 매핑
const statusColorMap = {
  PENDING: { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: RiTimeLine },
  STARTED: { bgColor: 'bg-blue-100', textColor: 'text-blue-800', icon: RiLoader4Line },
  SUCCESS: { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: RiCheckLine },
  FAILURE: { bgColor: 'bg-red-100', textColor: 'text-red-800', icon: RiCloseCircleLine },
};

interface TaskStatusTrackerProps {
  onComplete?: () => void;
}

const TaskStatusTracker = ({ onComplete }: TaskStatusTrackerProps) => {
  const { taskId, taskStatus } = useTaskStore();
  
  // 상태 변경 시 로깅 및 콜백 호출
  useEffect(() => {
    // 태스크가 성공적으로 완료되면 콜백 실행
    if (taskStatus === 'SUCCESS' && onComplete) {
      onComplete();
    }
  }, [taskStatus, onComplete]);

  // 현재 태스크 정보가 없는 경우 표시
  if (!taskId) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <div className="text-center text-gray-500">
          <p>현재 실행 중인 태스크가 없습니다.</p>
        </div>
      </div>
    );
  }
  
  // 태스크 상태에 따른 스타일 및 아이콘 가져오기
  const { bgColor, textColor, icon: StatusIcon } = statusColorMap[taskStatus || 'PENDING'] || {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: RiTimeLine,
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <h3 className="mb-3 font-medium text-gray-700">태스크 상태</h3>
      
      <div className={`mb-4 flex items-center rounded-md ${bgColor} p-3`}>
        <div className="mr-3">
          <StatusIcon className={`h-5 w-5 ${textColor} ${taskStatus === 'STARTED' ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <p className={`font-medium ${textColor}`}>
            {taskStatus === 'PENDING' && '대기 중...'}
            {taskStatus === 'STARTED' && '처리 중...'}
            {taskStatus === 'SUCCESS' && '완료됨'}
            {taskStatus === 'FAILURE' && '실패'}
            {!taskStatus && '상태 확인 중...'}
          </p>
          <p className="text-xs text-gray-600">태스크 ID: {taskId}</p>
        </div>
      </div>
      
      {taskStatus === 'FAILURE' && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          <p>처리 중 오류가 발생했습니다. 다시 시도해주세요.</p>
        </div>
      )}
      
      {taskStatus === 'SUCCESS' && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
          <p>변환이 완료되었습니다. 강의 목록에서 확인하세요.</p>
        </div>
      )}
    </div>
  );
};

export default TaskStatusTracker; 