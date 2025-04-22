'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RiFileList3Line } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface IHeaderAuthSectionProps {
  className?: string;
}

const HeaderAuthSection = ({ className }: IHeaderAuthSectionProps) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  console.log('session', session);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 이름의 첫 글자를 가져오는 함수
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || '?';
  };

  // 로그인 상태에 따라 다른 UI 렌더링
  if (status === 'loading') {
    // 로딩 상태일 때 스켈레톤 UI 표시
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user) {
    // 로그인된 상태 - 사용자 아바타와 드롭다운 메뉴 표시
    return (
      <div className={cn('flex items-center', className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 cursor-pointer rounded-full p-0 transition-all hover:bg-gray-100 focus:ring-0 focus:ring-offset-0"
            >
              <Avatar className="h-9 w-9 cursor-pointer border border-gray-200 transition-all hover:border-orange-300">
                {session.user.image ? (
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name || '사용자 아바타'}
                    className="cursor-pointer"
                  />
                ) : (
                  <AvatarFallback className="cursor-pointer bg-orange-50 text-orange-500">
                    {getInitials(session.user.name || '?')}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
            style={{ zIndex: 9999 }}
            sideOffset={4}
            forceMount
          >
            <div className="px-2 py-2.5">
              <div className="font-medium text-gray-800">{session.user.name || '사용자'}</div>
              <div className="text-xs text-gray-500">{session.user.email || ''}</div>
            </div>
            <DropdownMenuSeparator className="my-1 bg-gray-200" />
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              onClick={() => router.push('/mypage')}
            >
              <FaUser className="mr-2 h-4 w-4 text-gray-500" />
              <span>내 프로필</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              onClick={() => router.push('/dashboard')}
            >
              <RiFileList3Line className="mr-2 h-4 w-4 text-gray-500" />
              <span>대시보드</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              onClick={() => router.push('/settings')}
            >
              <FaCog className="mr-2 h-4 w-4 text-gray-500" />
              <span>설정</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-gray-200" />
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
              onClick={handleSignOut}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  <span>로그아웃 중...</span>
                </span>
              ) : (
                <>
                  <FaSignOutAlt className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // 로그인되지 않은 상태 - 로그인/회원가입 버튼 표시
  return (
    <motion.div
      className={cn('flex items-center space-x-2', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
        <Button
          variant="ghost"
          className="h-9 cursor-pointer rounded-lg text-background bg-accent px-4 text-sm font-medium transition-all hover:bg-gray-100"
        >
          로그인
        </Button>
      </Link>
    </motion.div>
  );
};

export default HeaderAuthSection;