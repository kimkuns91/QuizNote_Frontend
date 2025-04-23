'use client';

import { RiPauseCircleLine, RiPlayCircleLine, RiVolumeMuteLine, RiVolumeUpLine } from 'react-icons/ri';
import { useEffect, useRef, useState } from 'react';

import { Howl } from 'howler';
import { formatDuration } from '@/lib/date';
import { toast } from 'react-hot-toast';

interface AudioPlayerProps {
  audioFileId: string;
  fileName?: string;
}

export default function AudioPlayer({ audioFileId, fileName }: AudioPlayerProps) {
  // 오디오 재생 관련 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef<number>(0.7);
  const howlRef = useRef<Howl | null>(null);
  const seekInterval = useRef<NodeJS.Timeout | null>(null);

  // Howl 인스턴스 생성 및 관리
  useEffect(() => {
    if (audioFileId) {
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
        html5: true, // 스트리밍을 위해 HTML5 사용
        preload: true,
        format: ['mp3', 'wav', 'aac', 'ogg'],
        volume: isMuted ? 0 : volume,
        onload: () => {
          console.log('오디오 로드 완료');
          if (howlRef.current) {
            setDuration(howlRef.current.duration());
          }
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
        onloaderror: (id, error) => {
          console.error('오디오 로딩 에러:', {
            id,
            error,
            mediaFileId: audioFileId
          });
          
          toast.error('오디오 파일을 로드할 수 없습니다. 파일 형식이나 권한에 문제가 있을 수 있습니다.', {
            duration: 5000,
            action: {
              label: '재시도',
              onClick: () => {
                // 오디오 다시 로드
                if (howlRef.current) {
                  howlRef.current.unload();
                }
                
                // 새 Howl 인스턴스 생성
                howlRef.current = new Howl({
                  src: [`/api/audio/${audioFileId}?t=${Date.now()}`],
                  html5: true,
                  format: ['mp3', 'wav', 'aac', 'ogg'],
                  volume: isMuted ? 0 : volume
                });
              }
            }
          });
        },
        onplayerror: (id, error) => {
          console.error('오디오 재생 에러:', {
            id,
            error,
            mediaFileId: audioFileId
          });
          
          toast.error('오디오 재생 중 오류가 발생했습니다.');
          setIsPlaying(false);
          
          // 재생 오류 시 다시 시도
          if (howlRef.current) {
            howlRef.current.once('unlock', () => {
              howlRef.current?.play();
            });
          }
        }
      });
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
  }, [audioFileId, volume, isMuted]);

  // 볼륨 변경 시 Howl 인스턴스 업데이트
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(isMuted ? 0 : volume);
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
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (value === 0 && !isMuted) {
      setIsMuted(true);
    } else if (value > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      // 음소거 해제: 이전 볼륨으로 복원
      setIsMuted(false);
      setVolume(previousVolumeRef.current > 0 ? previousVolumeRef.current : 0.7);
    } else {
      // 음소거: 현재 볼륨 저장 후 0으로 설정
      previousVolumeRef.current = volume;
      setIsMuted(true);
      // howlRef.current?.volume(0);
    }
  };

  // 시간을 mm:ss 형식으로 포맷팅
  const formatTime = (time: number) => {
    return formatDuration(time);
  };

  return (
    <div className="rounded-xl bg-indigo-50 p-4 shadow-md">
      {fileName && (
        <div className="mb-2 text-xs text-gray-500">
          {fileName}
        </div>
      )}
      
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={togglePlay} 
              className="mr-3 text-indigo-600 focus:outline-none"
              aria-label={isPlaying ? "일시정지" : "재생"}
            >
              {isPlaying 
                ? <RiPauseCircleLine size={36} /> 
                : <RiPlayCircleLine size={36} />
              }
            </button>
            <div>
              <p className="text-xs text-gray-500">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center w-32">
            <button
              onClick={toggleMute}
              className="mr-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
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
              className="w-full h-2 rounded-lg appearance-none bg-indigo-200 accent-indigo-600"
            />
          </div>
        </div>
        
        <div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-lg appearance-none bg-indigo-200 accent-indigo-600"
          />
        </div>
      </div>
    </div>
  );
} 