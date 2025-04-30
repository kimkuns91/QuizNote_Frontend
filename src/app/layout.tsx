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
  title: {
    default: "QuizNote",
    template: "%s | QuizNote",
  },
  description: "QuizNote는 강의 노트를 쉽게 만들어주는 서비스입니다.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  keywords: [
    "퀴즈노트",
    "강의 노트",
    "학습 보조",
    "노트 정리",
    "학습 관리",
    "강의 자료",
    "퀴즈",
  ],
  authors: [
    { name: "QuizNote" },
  ],
  creator: "QuizNote",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "QuizNote",
    title: "QuizNote | 강의 노트를 쉽게 만들어주는 서비스",
    description: "QuizNote는 강의 노트를 쉽게 만들어주는 서비스입니다.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "QuizNote",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizNote | 강의 노트를 쉽게 만들어주는 서비스",
    description: "QuizNote는 강의 노트를 쉽게 만들어주는 서비스입니다.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "9TL8BLwbPBcob6zkBH7e6YcEa3HjSB8-SUBNTskG1a4",
    other: {
      "naver-site-verification":
        process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
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
