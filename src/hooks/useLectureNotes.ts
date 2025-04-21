'use client';

import {
  createLectureNote,
  createNoteSection,
  deleteLectureNote,
  deleteNoteSection,
  getLectureNoteById,
  getLectureNotes,
  updateLectureNote,
  updateNoteSection
} from '@/actions/note';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-hot-toast';

// 강의노트 타입 정의
export interface ILectureNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  lectureId: string;
  lecture?: {
    id: string;
    title: string;
    mediaFile?: {
      id: string;
      fileName: string;
      s3Url: string;
      transcript: string;
    };
  };
  sections?: INoteSection[];
}

// 강의노트 섹션 타입 정의
export interface INoteSection {
  id: string;
  title: string;
  content: string;
  order: number;
  noteId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 강의노트 생성 입력 타입
export interface ICreateLectureNoteInput {
  title: string;
  content: string;
  tags: string[];
  isPublic?: boolean;
  lectureId: string;
}

// 강의노트 업데이트 입력 타입
export interface IUpdateLectureNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  isPublic?: boolean;
}

// 노트 섹션 생성 입력 타입
export interface ICreateNoteSectionInput {
  noteId: string;
  title: string;
  content: string;
  order: number;
}

// 노트 섹션 업데이트 입력 타입
export interface IUpdateNoteSectionInput {
  title?: string;
  content?: string;
  order?: number;
}

// 강의노트 목록 조회 훅
export function useLectureNotes() {
  return useQuery({
    queryKey: ['lectureNotes'],
    queryFn: async () => {
      const result = await getLectureNotes();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data as ILectureNote[];
    }
  });
}

// 특정 강의노트 조회 훅
export function useLectureNote(noteId: string) {
  return useQuery({
    queryKey: ['lectureNote', noteId],
    queryFn: async () => {
      const response = await getLectureNoteById(noteId);
      
      if (!response.success) {
        throw new Error(response.error || '강의노트를 불러오는데 실패했습니다.');
      }
      
      return response.data;
    },
    enabled: !!noteId,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분 동안 캐시 저장
  });
}

// 강의노트 생성 훅
export function useCreateLectureNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ICreateLectureNoteInput) => {
      const response = await createLectureNote(data);
      
      if (!response.success) {
        throw new Error(response.error || '강의노트 생성에 실패했습니다.');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lectureNotes'] });
      toast.success('강의노트가 생성되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// 강의노트 업데이트 훅
export function useUpdateLectureNote(noteId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: IUpdateLectureNoteInput) => {
      const response = await updateLectureNote(noteId, data);
      
      if (!response.success) {
        throw new Error(response.error || '강의노트 업데이트에 실패했습니다.');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lectureNotes'] });
      queryClient.invalidateQueries({ queryKey: ['lectureNote', noteId] });
      toast.success('강의노트가 업데이트되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// 강의노트 삭제 훅
export function useDeleteLectureNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (noteId: string) => {
      const response = await deleteLectureNote(noteId);
      
      if (!response.success) {
        throw new Error(response.error || '강의노트 삭제에 실패했습니다.');
      }
      
      return response.data;
    },
    onMutate: async (noteId) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['lectureNotes'] });
      
      // 이전 데이터 저장
      const previousNotes = queryClient.getQueryData(['lectureNotes']);
      
      // 낙관적 업데이트
      queryClient.setQueryData(['lectureNotes'], (old: ILectureNote[] | undefined) => {
        if (!old) return [];
        return old.filter(note => note.id !== noteId);
      });
      
      return { previousNotes };
    },
    onError: (error: Error, _, context) => {
      // 에러 발생 시 이전 데이터로 복구
      if (context?.previousNotes) {
        queryClient.setQueryData(['lectureNotes'], context.previousNotes);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      // 성공 시 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['lectureNotes'] });
      toast.success('강의노트가 삭제되었습니다.');
    },
  });
}

// 강의노트 섹션 생성 훅
export function useCreateNoteSection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ICreateNoteSectionInput) => {
      const response = await createNoteSection(data);
      
      if (!response.success) {
        throw new Error(response.error || '섹션 생성에 실패했습니다.');
      }
      
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lectureNote', variables.noteId] });
      toast.success('섹션이 생성되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// 강의노트 섹션 업데이트 훅
export function useUpdateNoteSection(sectionId: string, noteId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: IUpdateNoteSectionInput) => {
      const response = await updateNoteSection(sectionId, data);
      
      if (!response.success) {
        throw new Error(response.error || '섹션 업데이트에 실패했습니다.');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lectureNote', noteId] });
      toast.success('섹션이 업데이트되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// 강의노트 섹션 삭제 훅
export function useDeleteNoteSection(noteId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sectionId: string) => {
      const response = await deleteNoteSection(sectionId);
      
      if (!response.success) {
        throw new Error(response.error || '섹션 삭제에 실패했습니다.');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lectureNote', noteId] });
      toast.success('섹션이 삭제되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
} 