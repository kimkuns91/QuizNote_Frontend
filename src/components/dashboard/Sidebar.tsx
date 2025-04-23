'use client';

import { RiArchiveLine, RiBook2Line, RiFileList3Line, RiHome5Line, RiMoonLine, RiSettings5Line, RiSunLine, RiUser3Line } from 'react-icons/ri';
import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import Logo from '@/components/common/Logo';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const Sidebar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  
  const navItems = [
    { icon: RiHome5Line, label: '홈', href: '/dashboard' },
    { icon: RiArchiveLine, label: '강의 목록', href: '/lectures' },
    { icon: RiBook2Line, label: '강의 노트', href: '/notes' },
    { icon: RiFileList3Line, label: '퀴즈', href: '/quiz' },
    // { icon: RiArchiveDrawerLine, label: '오답 노트', href: '/wrong-notes' },
  ];

  // 설정 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 다크모드 토글 핸들러
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside className="fixed left-0 top-0 z-30 h-full w-60 bg-background p-4 transition-all">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Logo />
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-2.5 text-sm font-sbagro font-medium transition-colors',
              pathname === item.href
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/20'
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-4 w-52 space-y-2">
        <div ref={settingsRef} className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex w-full items-center rounded-md bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <RiSettings5Line className="mr-2 h-5 w-5" />
            설정
          </button>
          
          {/* 설정 드롭다운 메뉴 */}
          {showSettings && (
            <div className="absolute bottom-full left-0 mb-2 w-full rounded-md border border-border bg-card p-2 shadow-lg">
              <Link href="/mypage" className="flex items-center rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent/20 transition-colors">
                <RiUser3Line className="mr-2 h-5 w-5" />
                내 프로필
              </Link>
              <Link href="/settings" className="flex items-center rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent/20 transition-colors">
                <RiSettings5Line className="mr-2 h-5 w-5" />
                환경설정
              </Link>
              <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent/20 transition-colors">
                <div className="flex items-center">
                  {theme === 'dark' ? (
                    <RiMoonLine className="mr-2 h-5 w-5" />
                  ) : (
                    <RiSunLine className="mr-2 h-5 w-5" />
                  )}
                  다크모드
                </div>
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="rounded-md bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground shadow-sm">
          <h3 className="font-medium">프리미엄으로 업그레이드</h3>
          <p className="mt-1 text-xs text-primary-foreground/80">무제한 변환과 고급 기능을 이용해보세요</p>
          <Link href="/pricing">
            <div className="mt-2 w-full rounded-md bg-card py-1.5 text-xs font-medium text-primary transition-colors hover:bg-muted text-center">
              자세히 보기
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
