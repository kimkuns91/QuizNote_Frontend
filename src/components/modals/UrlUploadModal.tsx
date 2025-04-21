'use client';

import React, { useRef, useState } from 'react';
import { RiCloseLine, RiDropboxFill, RiGoogleFill, RiYoutubeFill } from 'react-icons/ri';

import { motion } from 'framer-motion';
import { useModalStore } from '@/store/modalStore';

const UrlUploadModal = () => {
  const { closeModal } = useModalStore();
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
  };

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      setError('URL을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 여기에 URL 처리 로직 구현
      // 예시: const result = await processUrl(url);
      
      // 성공 시 다음 단계로 이동
      setActiveTab(2);
    } catch (error) {
      setError('URL 처리 중 오류가 발생했습니다.');
      console.error('URL processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 배경 클릭 시에만 모달 닫기
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <motion.div 
        className="relative w-full max-w-lg rounded-lg bg-white p-6"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭은 버블링 중단
      >
        {/* 닫기 버튼 */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <RiCloseLine className="h-6 w-6" />
        </button>

        {/* 탭 헤더 */}
        <div className="mb-6 flex">
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              } cursor-pointer`}
              onClick={() => setActiveTab(1)}
            >
              1
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">URL 입력</span>
          </div>
          <div className="mx-2 flex-1 border-t border-dashed border-gray-300 self-center"></div>
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                activeTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              } cursor-pointer`}
              onClick={() => setActiveTab(2)}
            >
              2
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">설정</span>
          </div>
        </div>

        {/* 탭 내용 */}
        {activeTab === 1 ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800">* URL 입력</h3>
            <p className="mb-4 text-sm text-gray-500">유튜브, 구글 드라이브, 드롭박스 등의 URL을 입력하세요.</p>

            {/* URL 입력 영역 */}
            <div className="mt-6">
              <div className="relative rounded-md">
                <input
                  ref={urlInputRef}
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  className="w-full rounded-md border border-gray-300 p-3 pr-24 text-sm"
                  placeholder="여기에 URL 붙여넣기"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                  <RiYoutubeFill className="h-6 w-6 text-red-500" />
                  <RiDropboxFill className="h-6 w-6 text-blue-500" />
                  <RiGoogleFill className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                지원되는 서비스: YouTube, SoundCloud, Google Drive, Dropbox
              </p>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800">* 설정</h3>
            <p className="mb-4 text-sm text-gray-500">URL 처리를 위한 설정을 선택하세요.</p>
            
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 font-medium text-gray-700">AI 모델 선택</h4>
                <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                  <option>기본 모델</option>
                  <option>고급 모델 (Pro 플랜)</option>
                </select>
              </div>
              
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 font-medium text-gray-700">언어 선택</h4>
                <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                  <option>한국어</option>
                  <option>영어</option>
                  <option>일본어</option>
                  <option>중국어</option>
                </select>
              </div>
              
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 font-medium text-gray-700">처리 옵션</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded" />
                    <span className="text-sm">자동 요약 생성</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded" />
                    <span className="text-sm">퀴즈 생성</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded" />
                    <span className="text-sm">키워드 추출</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex justify-center">
          {activeTab === 1 ? (
            <button
              onClick={handleUrlSubmit}
              disabled={isLoading}
              className={`rounded-md ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } px-6 py-2 text-center text-white`}
            >
              {isLoading ? '처리 중...' : '다음으로'}
            </button>
          ) : (
            <button
              onClick={closeModal}
              className="rounded-md bg-blue-500 px-6 py-2 text-center text-white hover:bg-blue-600"
            >
              완료
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UrlUploadModal; 