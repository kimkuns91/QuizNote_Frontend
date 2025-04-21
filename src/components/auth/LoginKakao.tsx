'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface LoginKakaoProps {
  handleKakaoLogin: () => Promise<void>;
  isLoading: boolean;
}

const LoginKakao = ({ handleKakaoLogin, isLoading }: LoginKakaoProps) => {
  const t = useTranslations('SignInForm');

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleKakaoLogin}
      disabled={isLoading}
      className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-[#FEE500] py-3 text-black transition-colors hover:bg-[#FEE500]/90"
    >
      <div className="relative h-5 w-5">
        <Image
          src="/images/kakao-logo.png"
          alt="Kakao Logo"
          width={20}
          height={20}
          className="object-contain"
        />
      </div>
      <span>{t('kakaoLogin')}</span>
    </Button>
  );
};

export default LoginKakao;
