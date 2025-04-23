'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { RiArrowLeftLine, RiCheckLine, RiDeleteBin6Line, RiSaveLine } from 'react-icons/ri';
import { useLectureNote, useUpdateLectureNote } from '@/hooks/useLectureNotes';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import TextareaAutosize from 'react-textarea-autosize';
import { Toggle } from '@/components/ui/toggle';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function EditNotePage() {
  const { noteId } = useParams<{ noteId: string }>();
  const router = useRouter();
  
  const { data: note, isLoading, isError } = useLectureNote(noteId);
  const { mutate: updateNote, isPending: isUpdating } = useUpdateLectureNote(noteId);
  
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    tags: string[];
    isPublic: boolean;
  }>({
    title: '',
    content: '',
    tags: [],
    isPublic: false,
  });
  
  const [tagInput, setTagInput] = useState('');
  
  // 데이터 로딩 완료 시 폼 초기화
  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags || [],
        isPublic: note.isPublic,
      });
    }
  }, [note]);
  
  // 입력 변경 처리
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 태그 추가
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };
  
  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };
  
  // 공개 여부 토글
  const handleTogglePublic = () => {
    setFormData(prev => ({
      ...prev,
      isPublic: !prev.isPublic,
    }));
  };
  
  // 폼 제출
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('제목을 입력하세요');
      return;
    }
    
    updateNote(
      {
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        isPublic: formData.isPublic,
      },
      {
        onSuccess: () => {
          toast.success('강의노트가 업데이트되었습니다');
          router.push(`/notes/${noteId}`);
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
          <Skeleton className="mb-4 h-6 w-24" />
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-10 w-40" />
        </Card>
      </div>
    );
  }
  
  if (isError || !note) {
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
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">강의노트 수정</h1>
              <p className="text-sm text-gray-500">노트 내용을 자유롭게 수정하세요</p>
            </div>
            <div className="flex items-center gap-2">
              <Toggle
                pressed={formData.isPublic}
                onPressedChange={handleTogglePublic}
                aria-label="공개 설정"
              >
                <RiCheckLine size={16} />
              </Toggle>
              <span className="text-sm font-medium text-gray-700">
                {formData.isPublic ? '공개' : '비공개'}
              </span>
            </div>
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
              placeholder="노트 제목을 입력하세요"
              className="w-full"
              required
            />
          </div>
          
          {/* 태그 */}
          <div className="mb-6">
            <label
              htmlFor="tags"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              태그
            </label>
            <div className="flex gap-2">
              <Input
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="태그 입력 후 추가"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                className="shrink-0"
              >
                추가
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <RiDeleteBin6Line size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 내용 */}
          <div className="mb-6">
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              내용
            </label>
            <TextareaAutosize
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="마크다운 형식으로 내용을 입력하세요"
              className="min-h-[500px] w-full resize-none rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              minRows={20}
            />
            <p className="mt-1 text-xs text-gray-500">
              # 제목, **굵게**, *기울임*와 같은 마크다운 문법을 사용할 수 있습니다.
            </p>
          </div>
          
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
