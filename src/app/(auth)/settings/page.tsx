import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import NotionKeyForm from '@/components/settings/NotionKeyForm';
import { Suspense } from 'react';
import { getNotionKey } from '@/actions/userActions';

// 설정 페이지 메인 컴포넌트
export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">설정</h1>
      
      <div className="grid gap-6">
        <Suspense fallback={<NotionKeyFormSkeleton />}>
          <NotionKeySection />
        </Suspense>
        
        {/* 추후 추가 설정 섹션들 */}
      </div>
    </div>
  );
}

// 노션 키 설정 섹션
async function NotionKeySection() {
  // 서버에서 현재 저장된 Notion 키 데이터 가져오기
  const notionKeyData = await getNotionKey();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notion 연동 설정</CardTitle>
        <CardDescription>
          Notion과 연동하여 강의 노트를 Notion 페이지로 내보낼 수 있습니다.
          API 키는 암호화되어 안전하게 저장됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotionKeyForm initialData={notionKeyData} />
      </CardContent>
    </Card>
  );
}

// 로딩 중 스켈레톤 UI
function NotionKeyFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-7 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
