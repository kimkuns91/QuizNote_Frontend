import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getUserStats } from '@/actions/userActions';
import { redirect } from 'next/navigation';

export default async function MyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/mypage');
  }

  // 사용자 통계 데이터 가져오기
  const userStats = await getUserStats();

  return (
    <div className="container mx-auto bg-background px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">마이페이지</h1>

      {/* 프로필 섹션 */}
      <Card className="mb-8 border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-foreground">프로필 정보</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-muted">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="프로필 이미지"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-bold text-primary">
                  {session.user.name?.[0] || session.user.email?.[0]}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {session.user.name || '이름 없음'}
              </h3>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 나의 학습 활동 섹션 */}
      <Card className="mb-8 border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-foreground">나의 학습 활동</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted p-4">
            <span className="text-2xl font-bold text-foreground">{userStats.notesCount}</span>
            <span className="text-muted-foreground">생성된 강의 노트</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted p-4">
            <span className="text-2xl font-bold text-foreground">{userStats.quizzesCount}</span>
            <span className="text-muted-foreground">완료한 퀴즈</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted p-4">
            <span className="text-2xl font-bold text-foreground">{userStats.studyTimeMinutes}</span>
            <span className="text-muted-foreground">학습 시간(분)</span>
          </div>
        </div>
      </Card>

      {/* 계정 설정 섹션 */}
      <Card className="border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-foreground">계정 설정</h2>
        <div className="space-y-4">
          {/* <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">프로필 수정</h3>
              <p className="text-sm text-muted-foreground">이름, 프로필 이미지 등을 변경합니다</p>
            </div>
            <Button
              variant="outline"
              asChild
              className="border-border bg-card text-foreground hover:bg-muted hover:text-foreground"
            >
              <Link href="/mypage/edit-profile">수정</Link>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">비밀번호 변경</h3>
              <p className="text-sm text-muted-foreground">계정 보안을 위해 비밀번호를 변경합니다</p>
            </div>
            <Button
              variant="outline"
              asChild
              className="border-border bg-card text-foreground hover:bg-muted hover:text-foreground"
            >
              <Link href="/mypage/change-password">변경</Link>
            </Button>
          </div> */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Notion 연동 설정</h3>
              <p className="text-sm text-muted-foreground">Notion API 키를 설정하여 강의 노트를 내보냅니다</p>
            </div>
            <Button
              variant="outline"
              asChild
              className="border-border bg-card text-foreground hover:bg-muted hover:text-foreground"
            >
              <Link href="/settings">설정</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}