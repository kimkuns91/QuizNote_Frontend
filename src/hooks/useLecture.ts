import { deleteLecture, getLecture, getLectures, updateLecture } from '@/actions/lectureActions';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-hot-toast';

export interface Lecture {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  mediaFileId: string | null;
  processingStatus: string;
  createdAt: Date;
  updatedAt: Date;
  mediaFile: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    mediaType: string;
    s3Key: string;
    s3Url: string;
    duration: number | null;
    transcript: string | null;
    editedTranscript: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  } | null;
  lectureNote: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  quiz: {
    id: string;
    title: string;
    description: string | null;
    difficulty: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    questions: {
      id: string;
      question: string;
      type: string;
      points: number;
      order: number;
      options: {
        id: string;
        text: string;
        isCorrect: boolean;
        order: number;
      }[];
    }[];
  } | null;
}

// InfiniteQuery 데이터 구조에 대한 타입 정의
interface LecturePageData {
  success: boolean;
  data: Lecture[];
  hasMore: boolean;
}

interface LectureInfiniteData {
  pages: LecturePageData[];
  pageParams: number[];
}

// 강의 목록 조회 (인피니트 스크롤)
export function useLectures() {
  return useInfiniteQuery({
    queryKey: ['lectures'],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getLectures(pageParam);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasMore ? Number(lastPageParam) + 1 : undefined;
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

// 단일 강의 조회
export function useLecture(lectureId: string) {
  return useQuery<Lecture, Error>({
    queryKey: ['lecture', lectureId],
    queryFn: async () => {
      const result = await getLecture(lectureId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    refetchInterval: (query) => 
      query.state.data?.processingStatus === 'processing' ? 3000 : false
  });
}

// 강의 삭제 훅 추가
export function useDeleteLecture() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lectureId: string) => {
      const result = await deleteLecture(lectureId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return { id: lectureId };
    },
    onMutate: async (lectureId) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['lectures'] });
      
      // 이전 데이터 저장
      const previousLectures = queryClient.getQueryData<LectureInfiniteData>(['lectures']);
      
      // 낙관적 업데이트 (인피니트 쿼리 데이터 구조에 맞게 수정)
      queryClient.setQueryData<LectureInfiniteData>(['lectures'], (old) => {
        if (!old) return { pages: [], pageParams: [] };
        
        // 각 페이지 내에서 해당 강의 필터링
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((lecture: Lecture) => lecture.id !== lectureId)
          }))
        };
      });
      
      return { previousLectures };
    },
    onError: (error: Error, _, context) => {
      // 에러 발생 시 이전 데이터로 복구
      if (context?.previousLectures) {
        queryClient.setQueryData(['lectures'], context.previousLectures);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      // 성공 시 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['lectures'] });
      toast.success('강의가 삭제되었습니다.');
    },
  });
}

// 강의 업데이트 훅
export function useUpdateLecture(lectureId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title?: string; description?: string }) => {
      const result = await updateLecture(lectureId, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lectures'] });
      queryClient.invalidateQueries({ queryKey: ['lecture', lectureId] });
      toast.success('강의가 업데이트되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
