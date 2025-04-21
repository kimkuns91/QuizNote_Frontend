import "@/styles/globals.css";

import { getLocale, getMessages, getTimeZone } from 'next-intl/server';

import type { Metadata } from "next";
import { Noto_Sans_KR } from 'next/font/google';
import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import localFont from 'next/font/local';

// Noto Sans KR 폰트 설정
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
});

// 로컬 SBAgro 폰트 적용 (포인트용)
const sbAgro = localFont({
  variable: '--font-sbagro',
  src: [
    {
      path: '../../public/fonts/SBAgro-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SBAgro-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SBAgro-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
});

export const metadata: Metadata = {
  title: "QuizNote",
  description: "QuizNote는 강의 노트를 쉽게 만들어주는 서비스입니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = await getTimeZone();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          notoSansKr.variable,
          sbAgro.variable
        )}
      >
          <Providers messages={messages} locale={locale} timeZone={timeZone}>
            {children}
          </Providers>
      </body>
    </html>
  );
}
