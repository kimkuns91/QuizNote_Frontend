'use client';

import { RiMusic2Line, RiPauseCircleLine, RiPlayCircleLine, RiRefreshLine, RiVolumeMuteLine, RiVolumeUpLine } from 'react-icons/ri';
import { useEffect, useRef, useState } from 'react';

import { Howl } from 'howler';
import { formatDuration } from '@/lib/date';
import { toast } from 'react-hot-toast';
import { useAudioStore } from '@/store/audioStore';

interface AudioPlayerProps {
  audioFileId: string;
  fileName?: string;
}

export default function AudioPlayer({ audioFileId, fileName }: AudioPlayerProps) {
  // Zustand 스토어에서 오디오 설정 가져오기
  const { volume, isMuted, actions } = useAudioStore();
  
  // 오디오 재생 관련 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0); // 로딩 진행률 상태 추가
  const previousVolumeRef = useRef<number>(0.7);
  const howlRef = useRef<Howl | null>(null);
  const seekInterval = useRef<NodeJS.Timeout | null>(null);

  // Howl 인스턴스 생성 및 관리
  const initAudio = () => {
    setIsLoading(true);
    setHasError(false);
    setLoadProgress(0);
    
    // 기존 인스턴스 정리
    if (howlRef.current) {
      howlRef.current.unload();
    }
    
    if (seekInterval.current) {
      clearInterval(seekInterval.current);
    }

    // 새 Howl 인스턴스 생성
    howlRef.current = new Howl({
      src: [`/api/audio/${audioFileId}?t=${Date.now()}`],
      html5: false, // 전체 파일 다운로드를 위해 HTML5 모드 비활성화
      preload: true,
      format: ['mp3', 'wav', 'aac', 'ogg'],
      volume: isMuted ? 0 : volume,
      onload: () => {
        console.log('오디오 로드 완료');
        if (howlRef.current) {
          setDuration(howlRef.current.duration());
          setIsLoading(false);
          setHasError(false);
          setLoadProgress(1); // 로드 완료
        }
      },
      onloaderror: (id, error) => {
        console.error('오디오 로딩 에러:', {
          id,
          error,
          mediaFileId: audioFileId
        });
        
        setIsLoading(false);
        setHasError(true);
        toast.error('오디오 파일을 로드할 수 없습니다');
      },
      onplay: () => {
        setIsPlaying(true);
        // 재생 중 시간 업데이트 인터벌 설정
        seekInterval.current = setInterval(() => {
          if (howlRef.current) {
            setCurrentTime(howlRef.current.seek() as number);
          }
        }, 1000);
      },
      onpause: () => {
        setIsPlaying(false);
        if (seekInterval.current) {
          clearInterval(seekInterval.current);
        }
      },
      onstop: () => {
        setIsPlaying(false);
        if (seekInterval.current) {
          clearInterval(seekInterval.current);
        }
      },
      onend: () => {
        setIsPlaying(false);
        if (seekInterval.current) {
          clearInterval(seekInterval.current);
        }
      },
      onplayerror: (id, error) => {
        console.error('오디오 재생 에러:', {
          id,
          error,
          mediaFileId: audioFileId
        });
        
        setHasError(true);
        toast.error('오디오 재생 중 오류가 발생했습니다');
        setIsPlaying(false);
        
        // 재생 오류 시 다시 시도
        if (howlRef.current) {
          howlRef.current.once('unlock', () => {
            howlRef.current?.play();
          });
        }
      }
    });

    // 로딩 진행 상황 모니터링
    const checkLoadProgress = setInterval(() => {
      if (howlRef.current) {
        const state = howlRef.current.state();
        if (state === 'loaded') {
          setLoadProgress(1);
          clearInterval(checkLoadProgress);
        } else if (state === 'loading') {
          // Howler는 정확한 로딩 진행률을 제공하지 않으므로, 시간에 따라 점진적으로 증가하는 방식으로 표현
          setLoadProgress((prev) => Math.min(prev + 0.05, 0.95));
        }
      }
    }, 500);
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    if (audioFileId) {
      initAudio();
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
      
      if (seekInterval.current) {
        clearInterval(seekInterval.current);
      }
    };
  }, [audioFileId, initAudio]);

  // 볼륨 변경 시 Howl 인스턴스 업데이트
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(isMuted ? 0 : volume);
    }
    
    // 볼륨 변경 시 이전 볼륨 저장 (음소거 해제 시 사용)
    if (!isMuted && volume > 0) {
      previousVolumeRef.current = volume;
    }
  }, [volume, isMuted]);

  // 오디오 플레이어 컨트롤 함수
  const togglePlay = () => {
    if (howlRef.current) {
      if (isPlaying) {
        howlRef.current.pause();
      } else {
        howlRef.current.play();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (howlRef.current) {
      howlRef.current.seek(time);
      // 이동 후 일시정지 상태라면 재생 시작
      if (!isPlaying && loadProgress >= 0.95) {
        howlRef.current.play();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    actions.setVolume(value);
  };

  const toggleMute = () => {
    actions.toggleMute();
    
    // 음소거 해제 시 이전 볼륨이 0이면 기본값으로 설정
    if (isMuted && previousVolumeRef.current === 0) {
      actions.setVolume(0.7);
    }
  };

  // 오디오 다시 로드
  const handleRetry = () => {
    initAudio();
  };

  // 시간을 mm:ss 형식으로 포맷팅
  const formatTime = (time: number) => {
    return formatDuration(time);
  };

  return (
    <div className="relative rounded-xl border-l-4 border-l-indigo-300 border-r border-t border-b border-gray-200 bg-white p-4 shadow-md transition-all hover:shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center">
          <RiMusic2Line className="mr-3 h-5 w-5 text-indigo-500" />
          <h3 className="text-md font-medium text-gray-800">
            {fileName ? fileName : '첨부된 오디오'}
          </h3>
        </div>
        {hasError && (
          <button 
            onClick={handleRetry}
            className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
            aria-label="오디오 다시 로드"
          >
            <RiRefreshLine className="mr-1 h-4 w-4" />
            다시 로드
          </button>
        )}
      </div>
      
      <div className="flex flex-col space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
            <span className="ml-3 text-sm text-gray-600">오디오 로딩 중...</span>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="text-center text-gray-600">
              <p className="mb-2 text-sm">오디오를 불러올 수 없습니다</p>
              <button 
                onClick={handleRetry}
                className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
              >
                <RiRefreshLine className="mr-1.5 h-4 w-4" />
                다시 시도
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={togglePlay} 
                  className="mr-3 rounded-full text-indigo-600 transition-colors hover:bg-indigo-50 focus:outline-none p-1"
                  aria-label={isPlaying ? "일시정지" : "재생"}
                >
                  {isPlaying 
                    ? <RiPauseCircleLine size={40} /> 
                    : <RiPlayCircleLine size={40} />
                  }
                </button>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center w-32">
                <button
                  onClick={toggleMute}
                  className="mr-2 rounded-full p-1 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none"
                  aria-label={isMuted ? "음소거 해제" : "음소거"}
                >
                  {isMuted 
                    ? <RiVolumeMuteLine className="h-5 w-5" /> 
                    : <RiVolumeUpLine className="h-5 w-5" />
                  }
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 rounded-lg appearance-none bg-indigo-100 accent-indigo-500"
                />
              </div>
            </div>
            
            <div className="px-1">
              {/* 로딩 진행률 표시 */}
              <div className="relative">
                <div 
                  className="absolute inset-0 h-2 rounded-lg bg-gray-200"
                  aria-hidden="true"
                />
                <div 
                  className="absolute inset-0 h-2 rounded-lg bg-indigo-100 transition-all duration-300" 
                  style={{ width: `${loadProgress * 100}%` }}
                  aria-label="오디오 로딩 진행률"
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.01"
                  value={currentTime}
                  onChange={handleSeek}
                  className="relative z-10 w-full h-2 rounded-lg appearance-none bg-transparent accent-indigo-500"
                  style={{ opacity: loadProgress < 0.95 ? 0.7 : 1 }}
                  disabled={loadProgress < 0.2}
                />
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-xs text-gray-500">0:00</span>
                <span className="text-xs text-gray-500">{formatTime(duration)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}