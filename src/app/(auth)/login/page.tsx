import Logo from '@/components/common/Logo';
import SignInForm from '@/components/auth/SignInForm';
import { cn } from '@/lib/utils';

interface LoginPageProps {
  searchParams?: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = await searchParams;

  return (
    <div className="from-background to-background/80 flex min-h-screen items-center justify-center bg-gradient-to-b p-4 transition-all duration-300 dark:from-indigo-950 dark:to-indigo-900">
      <div className="border-border bg-card w-full max-w-md rounded-xl border p-6 shadow-sm transition-all duration-300 dark:border-indigo-800 dark:bg-indigo-900/50 dark:shadow-lg">
        {/* 로고 */}
        <div className="flex items-center justify-center py-8">
          <Logo width={240} height={80} light />
        </div>

        {/* 제목과 설명 */}
        <h1
          className={cn(
            'mb-2 text-center text-2xl font-bold md:text-3xl',
            'text-foreground dark:text-gray-100'
          )}
        >
          효율적인 학습을 위한
        </h1>
        <h2
          className={cn(
            'mb-6 text-center text-2xl font-bold md:text-3xl',
            'text-foreground dark:text-gray-100'
          )}
        >
          스마트 AI 학습 플랫폼
        </h2>
        <p className={cn('mb-8 text-center text-sm', 'text-muted-foreground dark:text-gray-400')}>
          강의 내용 자동 요약, 퀴즈 생성으로 학습 효율을 높이세요
        </p>

        {/* 로그인 폼 */}
        <div className="w-full">
          <SignInForm callbackUrl={resolvedParams?.callbackUrl} />
        </div>
      </div>
    </div>
  );
}