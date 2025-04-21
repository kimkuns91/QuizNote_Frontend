// 인증 관련 환경 변수
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET; // NextAuth 암호화 키
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL; // NextAuth URL

// 소셜 로그인 관련 환경 변수
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Google OAuth 클라이언트 ID
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; // Google OAuth 클라이언트 시크릿
export const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID; // Kakao OAuth 클라이언트 ID
export const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET; // Kakao OAuth 클라이언트 시크릿

// API 관련 환경 변수
export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL; // API 기본 URL
export const EMAIL_USER = process.env.EMAIL_USER; // 이메일 발송 계정
export const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD; // 이메일 앱 비밀번호
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // 관리자 이메일

// OpenAI 관련 환경 변수
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // OpenAI API 키

// AWS S3 관련 환경 변수
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID; // AWS 액세스 키 ID
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY; // AWS 비밀 액세스 키
export const AWS_REGION = process.env.AWS_REGION; // AWS 리전 (ap-northeast-2: 서울)
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME; // S3 버킷 이름