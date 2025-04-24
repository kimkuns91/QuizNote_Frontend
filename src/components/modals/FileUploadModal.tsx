'use client';

import React, { useEffect, useRef, useState } from 'react';

import { RiCloseLine } from 'react-icons/ri';
import { createLecture } from '@/actions/lectureActions';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useModalStore } from '@/store/modalStore';
import { useTaskStore } from '@/store/taskStore';

// 업로드된 파일 정보 타입 정의
interface UploadedFileInfo {
  success: boolean;
  fileKey?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  fileUrl?: string;
  fileId?: string;
  error?: string;
}

// API 응답 타입
interface CreateLectureResult {
  success: boolean;
  taskId?: string;
  lectureId?: string;
  error?: string;
}

const FileUploadModal = () => {
  const { closeModal } = useModalStore();
  
  // 직접 액션 함수를 가져오기 (useTaskStore는 hooks에서만 작동하기 때문)
  const startPolling = useTaskStore.getState().startPolling;
  const taskStatus = useTaskStore.getState().taskStatus; // 현재 상태 확인
  
  const [activeTab, setActiveTab] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 파일 업로드 상태 관리
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // 업로드된 파일 정보 상태
  const [uploadedFileInfo, setUploadedFileInfo] = useState<UploadedFileInfo | null>(null);
  
  // 설정 상태 관리
  const [selectedModel, setSelectedModel] = useState('whisper-small');
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const [useTranscriptEditing, setUseTranscriptEditing] = useState(false);
  const [isCreatingLecture, setIsCreatingLecture] = useState(false);
  
  // 컴포넌트 마운트 시 로그
  useEffect(() => {
    console.log('FileUploadModal 마운트');
    return () => {
      console.log('FileUploadModal 언마운트');
    };
  }, []);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('파일을 선택해주세요.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      // API 직접 호출
      const response = await fetch('/api/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          mediaType: 'audio',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '업로드 URL 생성에 실패했습니다.');
      }

      const data = await response.json();
      const presignedUrl = data.presignedUrl;

      // XMLHttpRequest를 사용하여 업로드 진행률 추적
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error('파일 업로드에 실패했습니다.'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('파일 업로드 중 오류가 발생했습니다.'));
        };

        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      // 업로드 정보 저장
      setUploadedFileInfo({
        success: true,
        fileKey: data.audioFile.s3Key,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: data.presignedUrl,
        fileId: data.audioFile.id,
      });

      // 업로드 성공시 다음 단계로 이동
      setActiveTab(2);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNextClick = () => {
    if (file && !isUploading) {
      handleUpload();
    } else {
      setActiveTab(2);
    }
  };

  const handleCreateLecture = async () => {
    if (!uploadedFileInfo || !uploadedFileInfo.fileId || !uploadedFileInfo.fileKey) {
      toast.error('파일 정보가 없습니다. 다시 업로드해주세요.');
      return;
    }
    
    setIsCreatingLecture(true);
    console.log('강의 생성 시작');
    
    try {
      // Lecture 생성 요청
      const result = await createLecture({
        mediaFileId: uploadedFileInfo.fileId,
        title: (uploadedFileInfo.fileName || 'Untitled').replace(/\.[^/.]+$/, ''),
        selectedModel,
        selectedLanguage,
        useTranscriptEditing,
        s3Key: uploadedFileInfo.fileKey,
      }) as CreateLectureResult;
      
      console.log('강의 생성 결과:', result);
      
      if (result.success) {
        toast.success('강의가 생성되었습니다! 음성 변환, 강의노트 및 퀴즈 생성이 백그라운드에서 진행됩니다.', 
          {
            duration: 10000,
            icon: '🎉',
            style: {
              background: 'linear-gradient(to right, var(--accent), var(--primary))',
              color: 'var(--primary-foreground)',
            },
          }
        );
        
        // 성공 응답에서 taskId와 lectureId 가져오기
        const taskId = result.taskId;
        const lectureId = result.lectureId || '';
        
        if (taskId) {
          console.log('새 태스크 시작:', taskId, '강의 ID:', lectureId);
          
          // 로컬 스토리지에 직접 저장
          localStorage.setItem('lectureTaskId', taskId);
          localStorage.setItem('lectureId', lectureId);
          
          // 태스크 추적 시작 - 중요: 이 호출이 모달 닫기 전에 반드시 실행되어야 함
          startPolling(taskId, lectureId);
          
          // 메인 스토어도 직접 접근하여 설정 
          // (useTaskStore hook이 모달 닫힌 후 정리될 수 있어 직접 접근)
          const taskStore = useTaskStore.getState();
          taskStore.setTaskId(taskId);
          taskStore.setLectureId(lectureId || null);
          taskStore.setIsPolling(true);
          
          console.log('태스크 상태 설정 확인:', 
            'taskId=', useTaskStore.getState().taskId,
            'isPolling=', useTaskStore.getState().isPolling
          );
        } else {
          console.warn('태스크 ID가 없습니다:', result);
        }
        
        // 모달 닫기 전 지연 (상태 업데이트를 위한 시간 확보)
        setTimeout(() => {
          closeModal();
        }, 300);
      } else {
        // 에러 응답인 경우
        const errorMessage = result.error || '강의 생성에 실패했습니다.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Create lecture error:', error);
      toast.error('강의 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreatingLecture(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 배경 클릭 시에만 모달 닫기
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleBackdropClick}>
      <motion.div 
        className="relative w-full max-w-lg rounded-lg bg-card px-6 pt-18 pb-8 text-card-foreground"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭은 버블링 중단
      >
        {/* 닫기 버튼 */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <RiCloseLine className="h-6 w-6" />
        </button>

        {/* 탭 헤더 */}
        <div className="mb-6 flex">
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                activeTab === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              } cursor-pointer`}
              onClick={() => setActiveTab(1)}
            >
              1
            </div>
            <span className="ml-2 text-sm font-medium text-foreground">파일 업로드</span>
          </div>
          <div className="mx-2 flex-1 border-t border-dashed border-border self-center"></div>
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                activeTab === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              } cursor-pointer`}
              onClick={() => activeTab === 1 ? null : setActiveTab(2)}
            >
              2
            </div>
            <span className="ml-2 text-sm font-medium text-foreground">설정</span>
          </div>
        </div>

        {/* 탭 내용 */}
        {activeTab === 1 ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground">* 파일 업로드</h3>
            <p className="mb-4 text-sm text-muted-foreground">최대 업로드 파일 크기는 1GB(무료) / 10GB(PRO)입니다.</p>

            {/* 파일 업로드 영역 */}
            <div 
              className={`rounded-lg border-2 ${file ? 'border-primary' : 'border-border'} p-6`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="mb-6 flex justify-center">
                <div className="text-center">
                  {file ? (
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                          <svg
                            className="h-8 w-8 text-accent"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="mb-1 font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        onClick={() => setFile(null)}
                        className="mt-2 text-sm text-destructive hover:underline"
                      >
                        파일 제거
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                          <svg
                            className="h-8 w-8 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="mb-1 text-foreground">여기에 파일을 드래그 앤 드롭하거나</p>
                      <button
                        onClick={handleBrowseClick}
                        className="text-primary hover:text-primary/90 hover:underline"
                      >
                        브라우저
                      </button>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="audio/*"
                    onChange={handleFileChange}
                  />
                  <p className="mt-4 text-xs text-muted-foreground">
                    지원되는 형식: wav, mp3, m4a, caf, aiff, ogg
                  </p>
                </div>
              </div>
            </div>

            {/* 업로드 상태 표시 */}
            {isUploading && (
              <div className="mt-4">
                <div className="mb-1 flex justify-between">
                  <span className="text-xs font-medium text-foreground">업로드 중...</span>
                  <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 에러 메시지 */}
            {uploadError && (
              <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {uploadError}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground">* 설정</h3>
            <p className="mb-4 text-sm text-muted-foreground">파일 처리를 위한 설정을 선택하세요.</p>
            
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium text-foreground">AI 모델 선택</h4>
                <select 
                  className="w-full rounded-md border border-input p-2 text-sm"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option value="whisper-small">기본 모델 (Whisper Small)</option>
                  <option value="whisper-medium">중급 모델 (Whisper Medium)</option>
                  <option value="whisper-large">고급 모델 (Whisper Large) (Pro 플랜)</option>
                </select>
              </div>
              
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium text-foreground">언어 선택</h4>
                <select 
                  className="w-full rounded-md border border-input p-2 text-sm"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="ko">한국어</option>
                  <option value="en">영어</option>
                  <option value="jp">일본어</option>
                  <option value="zh">중국어</option>
                </select>
              </div>
              
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium text-foreground">처리 옵션</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2 rounded"
                      checked={useTranscriptEditing}
                      onChange={(e) => setUseTranscriptEditing(e.target.checked)}
                    />
                    <span className="text-sm">스크립트 가독성 향상 (LLM 수정)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 태스크 상태 표시 (선택 사항) */}
            {taskStatus && (
              <div className="mt-4 rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium text-foreground">처리 상태</h4>
                <div className="flex items-center">
                  {taskStatus === 'PENDING' && (
                    <>
                      <div className="mr-2 h-3 w-3 rounded-full bg-chart-3"></div>
                      <span className="text-sm">대기 중...</span>
                    </>
                  )}
                  {taskStatus === 'STARTED' && (
                    <>
                      <div className="mr-2 h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-sm">처리 중...</span>
                    </>
                  )}
                  {taskStatus === 'SUCCESS' && (
                    <>
                      <div className="mr-2 h-3 w-3 rounded-full bg-accent"></div>
                      <span className="text-sm">완료됨</span>
                    </>
                  )}
                  {taskStatus === 'FAILURE' && (
                    <>
                      <div className="mr-2 h-3 w-3 rounded-full bg-destructive"></div>
                      <span className="text-sm">실패</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex justify-center">
          {activeTab === 1 ? (
            <button
              onClick={handleNextClick}
              disabled={isUploading}
              className={`rounded-md ${
                isUploading
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              } px-6 py-2 text-center`}
            >
              {isUploading ? '업로드 중...' : '다음으로'}
            </button>
          ) : (
            <button
              onClick={handleCreateLecture}
              disabled={isCreatingLecture}
              className={`rounded-md ${
                isCreatingLecture
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              } px-6 py-2 text-center`}
            >
              {isCreatingLecture ? '생성 중...' : '완료'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FileUploadModal; 