'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ILogoProps {
  href?: string;
  className?: string;
  width?: number;
  height?: number;
  fullWidth?: boolean;
  light?: boolean;
}

export default function Logo({
  href = '/',
  className,
  width = 160,
  height = 30,
  fullWidth = false,
  light = false,
}: ILogoProps) {
  const logoContent = (
    <div className={cn('flex items-center pl-2', fullWidth && 'w-full justify-center', className)}>
      <Image
        src={light ? '/images/QuizNote.png' : '/images/QuizNote.png'}
        alt="QuizNote 로고"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={fullWidth ? 'block w-full' : ''}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}