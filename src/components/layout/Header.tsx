'use client';

import { LuMenu, LuSearch, LuX } from 'react-icons/lu';
import { useEffect, useState } from 'react';

import HeaderAuthSection from './HeaderAuthSection';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import { cn } from '@/lib/utils';
import { navItems } from '@/constants';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 스크롤 이벤트 감지하여 헤더 스타일 변경
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-[60] bg-white transition-all duration-300',
        isScrolled ? 'border-b border-gray-100 shadow-sm' : ''
      )}
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Logo href="/" width={170} height={32} className="py-1" />
          </div>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden space-x-1 md:flex lg:space-x-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors hover:text-accent',
                  pathname === item.href ? 'text-accent' : 'text-gray-700'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 검색창 및 로그인/회원가입 버튼 */}
          <div className="hidden items-center space-x-3 md:flex lg:space-x-4">
            <div className="relative">
              <LuSearch className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="검색어를 입력해주세요"
                className="w-[180px] rounded-full border-gray-200 bg-background pl-8 focus-visible:ring-primary lg:w-[300px]"
              />
            </div>
            <HeaderAuthSection />
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-50 hover:text-[#F58733] focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <LuX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <LuMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'block rounded-md px-3 py-2 text-base font-medium',
                  pathname === item.href
                    ? 'bg-[#F58733]/10 text-[#F58733]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#F58733]'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="relative mt-3 px-3">
                <LuSearch className="absolute top-2.5 left-5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="검색어를 입력해주세요"
                  className="w-full rounded-full border-gray-200 bg-gray-50 pl-8 focus-visible:ring-[#F58733]"
                />
              </div>
              <div className="mt-4 flex justify-center px-3">
                <HeaderAuthSection className="w-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}