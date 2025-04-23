'use server';

import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { signIn } from '@/lib/auth';

// 오류 타입 정의
interface NextAuthErrorWithEmail extends AuthError {
  email?: string;
  digest?: string;
}

/**
 * 이메일과 비밀번호로 로그인하는 Server Action
 */
export async function loginWithCredentials(
  email: string,
  password: string,
  redirectTo: string = '/'
) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: '이메일 또는 비밀번호가 올바르지 않습니다.',
          };
        default:
          return { success: false, error: '로그인 중 오류가 발생했습니다.' };
      }
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
}

/**
 * 회원가입을 처리하는 Server Action
 */
export async function registerUser(name: string, email: string) {
  try {
    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: '이미 사용 중인 이메일입니다.' };
    }

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error('회원가입 오류:', error);
    return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
  }
}

/**
 * 소셜 로그인(Google)을 처리하는 Server Action
 */
export async function loginWithGoogle(redirectTo: string = '/') {
  try {
    // Google 로그인 시도
    await signIn('google', { redirectTo });

    // 리다이렉션이 발생하므로 아래 코드는 실행되지 않음
    return { success: true };
  } catch (error) {
    // NEXT_REDIRECT 에러는 정상적인 리다이렉션이므로 다시 throw
    const authError = error as NextAuthErrorWithEmail;
    if (authError?.digest?.includes('NEXT_REDIRECT')) {
      throw error; // 리다이렉션을 위해 다시 throw
    }

    // AuthError 타입의 오류 처리
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'OAuthAccountNotLinked':
          // 이메일 주소 추출
          const email = (error as NextAuthErrorWithEmail)?.email || '';

          // 이메일 정보가 있으면 반환
          if (email) {
            return {
              success: false,
              error:
                '이 이메일은 이미 다른 로그인 방식으로 가입되어 있습니다. 해당 방식으로 로그인해주세요.',
              email: email,
            };
          }

          // 이메일 정보가 없는 경우 기본 오류 메시지
          return {
            success: false,
            error:
              '이 이메일은 이미 다른 로그인 방식으로 가입되어 있습니다. 해당 방식으로 로그인해주세요.',
          };
        default:
          return {
            success: false,
            error: 'Google 로그인 중 오류가 발생했습니다.',
          };
      }
    }

    // 기타 오류
    return {
      success: false,
      error: 'Google 로그인 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 소셜 로그인(Kakao)을 처리하는 Server Action
 */
export async function loginWithKakao(redirectTo: string = '/') {
  try {
    // 카카오 로그인 시도
    await signIn('kakao', { redirectTo });

    // 리다이렉션이 발생하므로 아래 코드는 실행되지 않음
    return { success: true };
  } catch (error) {
    // NEXT_REDIRECT 에러는 정상적인 리다이렉션이므로 다시 throw
    const authError = error as NextAuthErrorWithEmail;
    if (authError?.digest?.includes('NEXT_REDIRECT')) {
      throw error; // 리다이렉션을 위해 다시 throw
    }

    // AuthError 타입의 오류 처리
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'OAuthAccountNotLinked':
          // 이메일 주소 추출
          const email = (error as NextAuthErrorWithEmail)?.email || '';

          // 이메일 정보가 있으면 반환
          if (email) {
            return {
              success: false,
              error:
                '이 이메일은 이미 다른 로그인 방식으로 가입되어 있습니다. 해당 방식으로 로그인해주세요.',
              email: email,
            };
          }

          // 이메일 정보가 없는 경우 기본 오류 메시지
          return {
            success: false,
            error:
              '이 이메일은 이미 다른 로그인 방식으로 가입되어 있습니다. 해당 방식으로 로그인해주세요.',
          };
        default:
          return {
            success: false,
            error: 'Kakao 로그인 중 오류가 발생했습니다.',
          };
      }
    }

    // 기타 오류
    return {
      success: false,
      error: 'Kakao 로그인 중 오류가 발생했습니다.',
    };
  }
}
