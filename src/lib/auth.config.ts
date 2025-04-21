import type { NextAuthConfig } from 'next-auth';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  KAKAO_CLIENT_ID,
  KAKAO_CLIENT_SECRET,
  NEXTAUTH_URL,
} from '@/config';

import Google from 'next-auth/providers/google';
import type { JWT } from '@auth/core/jwt';
import Kakao from 'next-auth/providers/kakao';
import type { Session } from '@auth/core/types';

// 디버깅을 위한 환경 변수 로그
console.log('KAKAO_CLIENT_ID:', !!KAKAO_CLIENT_ID);
console.log('KAKAO_CLIENT_SECRET:', !!KAKAO_CLIENT_SECRET);
console.log('NEXTAUTH_URL:', NEXTAUTH_URL);

export const authConfig = {
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Kakao({
      clientId: KAKAO_CLIENT_ID as string,
      clientSecret: KAKAO_CLIENT_SECRET as string,
      authorization: {
        url: 'https://kauth.kakao.com/oauth/authorize',
        params: {
          scope: 'profile_nickname profile_image account_email',
        },
      },
      profile(profile) {
        console.log('Kakao profile:', profile); // 디버깅을 위한 로그
        return {
          id: profile.id.toString(),
          name:
            profile.properties?.nickname || profile.kakao_account?.profile?.nickname || 'Unknown',
          email: profile.kakao_account?.email || `${profile.id}@kakao.com`,
          image:
            profile.properties?.profile_image || profile.kakao_account?.profile?.profile_image_url,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 1 day
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development', // 개발 환경에서 디버깅 활성화
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }: { token: JWT }) {
      return token;
    },
  },
} satisfies NextAuthConfig;