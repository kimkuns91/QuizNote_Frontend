import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IAudioState {
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  actions: {
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    setPlaybackRate: (rate: number) => void;
  };
}

export const useAudioStore = create<IAudioState>()(
  persist(
    (set) => ({
      volume: 0.7,
      isMuted: false,
      playbackRate: 1.0,
      actions: {
        setVolume: (volume: number) => 
          set(() => {
            // 볼륨 변경 시 음소거 상태 자동 변경
            const isMuted = volume === 0;
            return { volume, isMuted };
          }),
          
        toggleMute: () => 
          set((state) => ({
            isMuted: !state.isMuted
          })),
          
        setPlaybackRate: (rate: number) => 
          set({ playbackRate: rate }),
      },
    }),
    {
      name: 'audio-settings',
      // 세션 중 메모리에만 저장하고 싶으면 false로 설정
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
); 