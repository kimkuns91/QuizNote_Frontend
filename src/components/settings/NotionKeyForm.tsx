'use client';

import { EyeIcon, EyeOffIcon, TrashIcon } from 'lucide-react';
import { deleteNotionKey, saveNotionKey } from '@/actions/userActions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// NotionKey 데이터 타입 정의
type NotionKeyData = {
  token: string;
  pageId: string;
} | null;

interface NotionKeyFormProps {
  initialData: NotionKeyData;
}

export default function NotionKeyForm({ initialData }: NotionKeyFormProps) {
  // 상태 관리
  const [notionKey, setNotionKey] = useState(initialData?.token || '');
  const [notionPageId, setNotionPageId] = useState(initialData?.pageId || '');
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notion 키 저장 핸들러
  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notionKey) {
      alert('Notion API 키를 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await saveNotionKey(notionKey, notionPageId);
      
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch {
      alert('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Notion 키 삭제 핸들러
  const handleDeleteKey = async () => {
    if (!initialData) return;
    
    if (!confirm('Notion API 키를 삭제하시겠습니까?')) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await deleteNotionKey();
      
      if (result.success) {
        setNotionKey('');
        setNotionPageId('');
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch {
      alert('Notion 키 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSaveKey} className="space-y-4">
      {/* Notion API 키 입력 필드 */}
      <div className="space-y-2">
        <label htmlFor="notionKey" className="text-sm font-medium">
          Notion API 키
        </label>
        <div className="relative">
          <Input
            id="notionKey"
            type={showKey ? 'text' : 'password'}
            value={notionKey}
            onChange={(e) => setNotionKey(e.target.value)}
            placeholder="secret_..."
            className="pr-10"
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Notion Integration에서 발급받은 API 키를 입력하세요.
        </p>
      </div>

      {/* Notion 페이지 ID 입력 필드 (선택 사항) */}
      <div className="space-y-2">
        <label htmlFor="notionPageId" className="text-sm font-medium">
          Notion 페이지 ID (선택 사항)
        </label>
        <Input
          id="notionPageId"
          type="text"
          value={notionPageId}
          onChange={(e) => setNotionPageId(e.target.value)}
          placeholder="기본 Notion 페이지 ID (선택 사항)"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500">
          노트를 저장할 Notion 페이지 ID입니다. 미입력 시 강의노트 내보내기 시 지정해야 합니다.
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-between pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-24"
        >
          {isSubmitting ? '저장 중...' : '저장'}
        </Button>
        
        {initialData && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteKey}
            disabled={isSubmitting}
            className="w-24"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            삭제
          </Button>
        )}
      </div>
    </form>
  );
} 