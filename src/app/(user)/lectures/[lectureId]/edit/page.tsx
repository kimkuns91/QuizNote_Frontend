'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { RiArrowLeftLine, RiSaveLine } from 'react-icons/ri';
import { useLecture, useUpdateLecture } from '@/hooks/useLecture';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import TextareaAutosize from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function EditLecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const router = useRouter();
  
  const { data: lecture, isLoading, isError } = useLecture(lectureId);
  const { mutate: updateLecture, isPending: isUpdating } = useUpdateLecture(lectureId);
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
  }>({
    title: '',
    description: '',
  });
  
  // 데이터 로딩 완료 시 폼 초기화
  useEffect(() => {
    if (lecture) {
      setFormData({
        title: lecture.title,
        description: lecture.description || '',
      });
    }
  }, [lecture]);
  
  // 입력 변경 처리
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 폼 제출
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('제목을 입력하세요');
      return;
    }
    
    updateLecture(
      {
        title: formData.title,
        description: formData.description,
      },
      {
        onSuccess: () => {
          toast.success('강의가 업데이트되었습니다');
          router.push(`/lectures/${lectureId}`);
        },
      }
    );
  };
  
  // 취소
  const handleCancel = () => {
    router.back();
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-full">
        <div className="mb-6">
          <Skeleton className="h-8 w-40" />
        </div>
        <Card className="p-6">
          <Skeleton className="mb-6 h-10 w-full" />
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="mb-6 h-40 w-full" />
          <Skeleton className="h-10 w-40" />
        </Card>
      </div>
    );
  }
  
  if (isError || !lecture) {
    return notFound();
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6 max-w-full"
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          className="flex items-center text-gray-600"
          onClick={handleCancel}
        >
          <RiArrowLeftLine className="mr-2 h-4 w-4" />
          뒤로가기
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full">
        <Card className="overflow-hidden border border-gray-200 p-6 shadow-md w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">강의 정보 수정</h1>
            <p className="text-sm text-gray-500">강의 제목과 설명을 수정하세요</p>
          </div>
          
          {/* 제목 */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              제목
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="강의 제목을 입력하세요"
              className="w-full"
              required
            />
          </div>
          
          {/* 설명 */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              설명
            </label>
            <TextareaAutosize
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="강의에 대한 설명을 입력하세요"
              className="min-h-[150px] w-full resize-none rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              minRows={5}
            />
          </div>
          
          {/* 미디어 파일 정보 (읽기 전용) */}
          {lecture.mediaFile && (
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-gray-700">미디어 파일 정보</h2>
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">파일명:</span> {lecture.mediaFile.fileName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">파일 크기:</span> {(lecture.mediaFile.fileSize / (1024 * 1024)).toFixed(2)} MB
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">파일 유형:</span> {lecture.mediaFile.fileType}
                </p>
                {lecture.mediaFile.duration && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">재생 시간:</span> {Math.floor(lecture.mediaFile.duration / 60)}분 {lecture.mediaFile.duration % 60}초
                  </p>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">미디어 파일은 변경할 수 없습니다. 새 파일을 업로드하려면 새 강의를 생성하세요.</p>
            </div>
          )}
          
          {/* 버튼 */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? (
                <span className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  저장 중...
                </span>
              ) : (
                <span className="flex items-center">
                  <RiSaveLine className="mr-2" />
                  저장하기
                </span>
              )}
            </Button>
          </div>
        </Card>
      </form>
    </motion.div>
  );
}
