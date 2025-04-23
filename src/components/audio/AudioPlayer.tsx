'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RiMusic2Line, RiPauseCircleLine, RiPlayCircleLine, RiVolumeMuteLine, RiVolumeUpLine } from 'react-icons/ri';

import { formatDuration } from '@/lib/date';
import { toast } from 'react-hot-toast';
import { useAudioStore } from '@/store/audioStore';

interface AudioPlayerProps {
  audioId: string;
  fileName?: string;
  className?: string;
  showDebugInfo?: boolean;
}

export default function AudioPlayer({ audioId, fileName, className = '', showDebugInfo = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // 오디오 스토어 연결
  const { volume, isMuted, playbackRate, actions } = useAudioStore();
  const { setVolume, toggleMute, setPlaybackRate } = actions;
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // 오디오 URL 생성 (캐시 방지를 위한 타임스탬프 포함)
  const audioUrl = `/api/audio/${audioId}?t=${Date.now()}`;
  
  // 오디오 초기화 및 이벤트 리스너 설정
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // 스토어 값으로 초기 설정
    audio.volume = volume;
    audio.muted = isMuted;
    audio.playbackRate = playbackRate;
    
    const handleLoadStart = () => {
      console.log('오디오 로딩 시작');
      setIsLoading(true);
      setHasError(false);
    };
    
    const handleLoadedMetadata = () => {
      console.log('오디오 메타데이터 로드됨', {
        duration: audio.duration,
        src: audio.src
      });
      setDuration(audio.duration);
      setIsLoading(false);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    
    const handleError = (e: ErrorEvent) => {
      console.error('오디오 로드 오류:', e);
      setIsLoading(false);
      setHasError(true);
      setErrorMessage('오디오 파일을 로드할 수 없습니다.');
      toast.error('오디오 파일을 로드할 수 없습니다');
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    // 이벤트 리스너 등록
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as EventListener);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    // 상태 초기화
    setIsLoading(true);
    setHasError(false);
    
    // 클린업 함수
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as EventListener);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      
      audio.pause();
    };
  }, [audioId, volume, isMuted, playbackRate]);
  
  // 스토어 값이 변경될 때 오디오 요소 업데이트
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);
  
  // 오디오 재생/일시정지 토글
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('재생 실패:', err);
        toast.error('오디오 재생을 시작할 수 없습니다');
      });
    }
  };
  
  // 볼륨 조절
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };
  
  // 음소거 토글
  const handleToggleMute = () => {
    toggleMute();
  };
  
  // 재생 속도 조절
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };
  
  // 시간 포맷팅
  const formatTime = (time: number) => {
    return formatDuration(time);
  };
  
  // 프로그레스 바 클릭 처리
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    // 유효한 시간 범위 내에서만 설정
    if (newTime >= 0 && newTime <= duration) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // 재시도 처리
  const handleRetry = () => {
    if (!audioRef.current) return;
    
    // 오디오 요소 리셋 및 다시 로드
    audioRef.current.pause();
    audioRef.current.load();
    setIsLoading(true);
    setHasError(false);
  };
  
  const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  
  return (
    <div className={`rounded-xl border-l-4 border-l-indigo-500 border-r border-t border-b border-gray-200 bg-white p-6 shadow-md ${className}`}>
      {/* 오디오 요소 (숨김) */}
      <audio 
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        className="hidden"
      />
      
      {/* 헤더 섹션 */}
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <RiMusic2Line className="h-6 w-6 text-indigo-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            {fileName || '첨부된 오디오'}
          </h3>
          <p className="text-xs text-gray-500">{formatTime(duration)}</p>
        </div>
      </div>
      
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
          <span className="ml-3 text-sm text-gray-600">오디오 로딩 중...</span>
        </div>
      )}
      
      {/* 오류 상태 */}
      {hasError && (
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="text-center text-gray-600">
            <p className="mb-2 text-sm">{errorMessage || '오디오를 불러올 수 없습니다'}</p>
            <button 
              onClick={handleRetry}
              className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}
      
      {/* 플레이어 컨트롤 (로딩 중이거나 오류가 아닐 때만 표시) */}
      {!isLoading && !hasError && (
        <>
          {/* 프로그레스 바 */}
          <div 
            ref={progressBarRef}
            className="relative mb-4 h-2.5 cursor-pointer rounded-full bg-gray-200"
            onClick={handleProgressBarClick}
          >
            <div 
              className="absolute left-0 top-0 h-full rounded-full bg-indigo-500"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
          </div>
          
          {/* 시간 표시 */}
          <div className="mb-4 flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          {/* 컨트롤 - 메인 섹션 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* 재생/일시정지 버튼 */}
              <button 
                onClick={togglePlay} 
                className="mr-4 rounded-full text-indigo-600 hover:text-indigo-700 transition"
                aria-label={isPlaying ? '일시정지' : '재생'}
              >
                {isPlaying 
                  ? <RiPauseCircleLine size={48} /> 
                  : <RiPlayCircleLine size={48} />
                }
              </button>
              
              {/* 볼륨 컨트롤 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleMute}
                  className="text-gray-500 hover:text-indigo-600 transition"
                  aria-label={isMuted ? '음소거 해제' : '음소거'}
                >
                  {isMuted 
                    ? <RiVolumeMuteLine size={22} /> 
                    : <RiVolumeUpLine size={22} />
                  }
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-indigo-500"
                  aria-label="볼륨"
                />
              </div>
            </div>
            
            {/* 재생 속도 */}
            <div className="flex items-center">
              <span className="mr-2 text-xs text-gray-500">속도</span>
              <select
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="rounded border-gray-200 bg-gray-50 text-xs px-2 py-1 text-gray-700 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {playbackRates.map(rate => (
                  <option key={rate} value={rate}>
                    {rate}x
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
      
      {/* 디버깅 정보 (디버그 모드일 때만 표시) */}
      {showDebugInfo && (
        <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <p>오디오 ID: {audioId}</p>
          <p>URL: {audioUrl}</p>
          <p>상태: {isLoading ? '로딩 중' : hasError ? '오류' : '준비됨'}</p>
          <p>볼륨: {volume.toFixed(2)}, 음소거: {isMuted ? '예' : '아니오'}, 재생 속도: {playbackRate}x</p>
        </div>
      )}
    </div>
  );
} 