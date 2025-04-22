import CryptoJS from 'crypto-js';

// 암호화 시 사용할 비밀 키 (실제 환경에서는 환경 변수로 설정하는 것이 좋습니다)
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-secret-key';

/**
 * 문자열을 암호화합니다.
 * @param text 암호화할 텍스트
 * @returns 암호화된 문자열
 */
export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

/**
 * 암호화된 문자열을 복호화합니다.
 * @param encryptedText 암호화된 텍스트
 * @returns 복호화된 원본 문자열
 */
export function decrypt(encryptedText: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
} 