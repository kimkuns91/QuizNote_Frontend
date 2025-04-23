'use client';

import { Button } from '@/components/ui/button';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { loginWithKakao } from '@/actions/authActions';
import { motion } from 'framer-motion';
// import { signIn } from '@/lib/auth';
import { useState } from 'react';

interface ISignInFormProps {
  callbackUrl?: string;
}

export default function SignInForm({ callbackUrl = '/' }: ISignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoSignIn = async () => {
    try {
      setIsLoading(true);
      
      // 실제 구현 예시 (주석 처리)
      await loginWithKakao(callbackUrl);
      
      // 임시 로직 (데모용)
      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 1500);
      
    } catch (error) {
      console.error('로그인 오류:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* 소셜 로그인 버튼 */}
      <motion.div
        className="mb-4 flex flex-col space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Button
          type="button"
          onClick={handleKakaoSignIn}
          disabled={isLoading}
          className={cn(
            'h-11 w-full bg-[#FEE500] font-medium text-black hover:bg-[#FDD835]',
            'flex cursor-pointer items-center justify-center',
            'shadow-sm transition-all duration-200 hover:shadow-md',
            'text-sm sm:text-base'
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              로그인 중...
            </span>
          ) : (
            <div className="flex items-center justify-center" onClick={handleKakaoSignIn}>
              <RiKakaoTalkFill className="mr-2 h-5 w-5" />
              <span>카카오 계정으로 로그인</span>
            </div>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}