'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { WithContext as ReactTagInput, Tag } from 'react-tag-input';
import { RiArrowLeftLine, RiCheckLine, RiEyeLine, RiSaveLine } from 'react-icons/ri';
import { useLectureNote, useUpdateLectureNote } from '@/hooks/useLectureNotes';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MarkdownPreview from '@/components/MarkdownPreview';
import { Skeleton } from '@/components/ui/skeleton';
import TextareaAutosize from 'react-textarea-autosize';
import { Toggle } from '@/components/ui/toggle';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { toast } from 'react-hot-toast';

// 태그 입력 관련 설정
const KeyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

export default function EditNotePage() {
  const { noteId } = useParams<{ noteId: string }>();
  const router = useRouter();
  
  const { data: note, isLoading, isError } = useLectureNote(noteId);
  const { mutate: updateNote, isPending: isUpdating } = useUpdateLectureNote(noteId);
  
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    tags: Tag[];
    isPublic: boolean;
  }>({
    title: '',
    content: '',
    tags: [],
    isPublic: false,
  });
  
  // 데이터 로딩 완료 시 폼 초기화
  useEffect(() => {
    if (note) {
      try {
        const tagsData = (note.tags || []).map((tag) => ({
          id: tag,
          text: tag
        } as unknown as Tag));
        
        setFormData({
          title: note.title,
          content: note.content,
          tags: tagsData,
          isPublic: note.isPublic,
        });
      } catch (error) {
        console.error('태그 변환 중 오류 발생:', error);
        setFormData({
          title: note.title,
          content: note.content,
          tags: [],
          isPublic: note.isPublic,
        });
      }
    }
  }, [note]);
  
  // 입력 변경 처리
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 태그 추가/삭제 처리
  const handleTagsChange = (tags: Tag[]) => {
    setFormData(prev => ({ ...prev, tags }));
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
        tags: formData.tags.map(tag => tag.text),
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
      <div className="h-screen w-full p-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
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
      className="h-screen w-full p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center text-gray-600"
          onClick={handleCancel}
        >
          <RiArrowLeftLine className="mr-2 h-4 w-4" />
          뒤로가기
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Toggle
              pressed={formData.isPublic}
              onPressedChange={handleTogglePublic}
              aria-label="공개 설정"
              className={formData.isPublic ? "bg-green-100" : "bg-gray-100"}
            >
              <RiCheckLine size={16} />
            </Toggle>
            <span className="text-sm font-medium text-gray-700">
              {formData.isPublic ? '공개' : '비공개'}
            </span>
          </div>

          <Button
            type="submit"
            form="note-edit-form"
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
      </div>
      
      <div className="grid h-[calc(100vh-120px)] grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 에디터 영역 - 왼쪽 */}
        <div className="h-full overflow-auto">
          <Card className="h-full overflow-auto border border-gray-200 p-6 shadow-md">
            <form id="note-edit-form" onSubmit={handleSubmit} className="h-full">
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
              
              {/* 태그 - 라이브러리 사용 */}
              <div className="mb-6">
                <label
                  htmlFor="tags"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  태그
                </label>
                <div className="tag-input-container">
                  <ReactTagInput
                    tags={formData.tags}
                    handleDelete={(i) => {
                      const newTags = formData.tags.filter((_, index) => index !== i);
                      handleTagsChange(newTags);
                    }}
                    handleAddition={(tag) => {
                      handleTagsChange([...formData.tags, tag]);
                    }}
                    placeholder="태그 입력 후 Enter"
                    delimiters={delimiters}
                    inputFieldPosition="bottom"
                    allowDragDrop={false}
                    classNames={{
                      tagInputField: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500',
                      tag: 'bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2 mb-2 inline-flex items-center',
                      remove: 'ml-2 text-blue-600 hover:text-blue-800 cursor-pointer',
                    }}
                  />
                </div>
              </div>
              
              {/* 내용 */}
              <div className="mb-3">
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
                  className="min-h-[calc(100vh-400px)] w-full resize-none rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-mono"
                  minRows={20}
                />
                <p className="mt-1 text-xs text-gray-500">
                  # 제목, **굵게**, *기울임*와 같은 마크다운 문법을 사용할 수 있습니다.
                </p>
              </div>
            </form>
          </Card>
        </div>
        
        {/* 미리보기 영역 - 오른쪽 */}
        <div className="h-full overflow-auto">
          <Card className="h-full overflow-auto border border-gray-200 p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">미리보기</h2>
              <div className="flex items-center text-blue-600">
                <RiEyeLine className="mr-1 h-4 w-4" />
                <span className="text-sm">실시간 보기</span>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h1 className="mb-3 text-2xl font-bold text-gray-800">{formData.title || '제목 없음'}</h1>
              
              {formData.tags.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 shadow-sm"
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                최근 수정: {new Date().toLocaleDateString('ko-KR')}
              </p>
            </div>
            
            <MarkdownPreview content={formData.content} />
          </Card>
        </div>
      </div>
      
      <style jsx global>{`
        .ReactTags__selected {
          display: flex;
          flex-wrap: wrap;
        }
        .ReactTags__tag {
          display: flex;
          align-items: center;
        }
        .ReactTags__tagInput {
          flex: 1;
          margin-top: 0.5rem;
          width: 100%;
        }
      `}</style>
    </motion.div>
  );
}
