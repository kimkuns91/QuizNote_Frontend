import { format, formatDistanceToNow } from 'date-fns';

import { ko } from 'date-fns/locale';

// 표준 날짜 형식 (2023년 4월 15일)
export function formatDate(date: Date | string | number): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(dateObj, 'PPP', { locale: ko });
}

// 짧은 날짜 형식 (23.04.15)
export function formatShortDate(date: Date | string | number): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(dateObj, 'yy.MM.dd', { locale: ko });
}

// 시간 포함 날짜 형식 (2023년 4월 15일 오후 3:30)
export function formatDateTime(date: Date | string | number): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(dateObj, 'PPP p', { locale: ko });
}

// 상대적 시간 표시 (3일 전, 5분 전 등)
export function formatRelativeTime(date: Date | string | number): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ko });
}

// 요일 포함 날짜 형식 (2023년 4월 15일 토요일)
export function formatDateWithDay(date: Date | string | number): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(dateObj, 'PPP EEEE', { locale: ko });
}

// 시간 형식 (hh:mm:ss)
export function formatTime(date: Date | string | number): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(dateObj, 'HH:mm:ss', { locale: ko });
}

// 초를 mm:ss 형식으로 변환 (오디오 플레이어용)
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
} 