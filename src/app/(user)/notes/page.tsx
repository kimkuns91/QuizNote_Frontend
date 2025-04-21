'use client';

import {
  ICreateLectureNoteInput,
  useCreateLectureNote,
  useDeleteLectureNote,
  useLectureNotes
} from '@/hooks/useLectureNotes';
import { RiAddLine, RiDeleteBin6Line, RiEdit2Line, RiFileListLine } from 'react-icons/ri';

import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useLectures } from '@/hooks/useLecture';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 애니메이션 변수
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function NotesPage() {
  const router = useRouter();
  const { data: notes, isLoading, isError } = useLectureNotes();
  const { data: lectures } = useLectures();
  const { mutate: createNote, isPending: isCreating } = useCreateLectureNote();
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteLectureNote();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNote, setNewNote] = useState<ICreateLectureNoteInput>({
    title: '',
    content: '',
    tags: [],
    isPublic: false,
    lectureId: '',
  });
  
  const handleCreateNote = () => {
    if (!newNote.lectureId) {
      toast.error('강의를 선택해주세요.');
      return;
    }
    
    createNote(newNote, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setNewNote({
          title: '',
          content: '',
          tags: [],
          isPublic: false,
          lectureId: '',
        });
      }
    });
  };
  
  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('정말로 이 강의노트를 삭제하시겠습니까?')) {
      deleteNote(noteId);
    }
  };
  
  const handleViewNote = (noteId: string) => {
    router.push(`/notes/${noteId}`);
  };
  
  const handleEditNote = (noteId: string) => {
    router.push(`/notes/${noteId}/edit`);
  };
  
  if (isLoading) {
    return (
      <div>
        {/* 헤더 영역 스켈레톤 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* 노트 목록 스켈레톤 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex justify-between">
                <div className="flex items-center">
                  <Skeleton className="mr-2 h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              <div className="mb-4">
                {/* 태그 스켈레톤 */}
                <div className="mb-3 flex flex-wrap gap-1">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
                <Skeleton className="h-4 w-64" />
              </div>

              <div className="mt-auto border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <p className="text-red-600">강의노트를 불러오는데 실패했습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 헤더 영역 */}
      <motion.div 
        className="mb-8 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">강의노트</h1>
          <p className="text-gray-500">모든 강의 내용과 중요 포인트를 정리하여 관리하세요.</p>
        </div>
        <motion.button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RiAddLine className="mr-2" />
          새 노트 만들기
        </motion.button>
      </motion.div>
      
      {/* 노트 목록 */}
      {notes && notes.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {notes.map((note) => (
            <motion.div
              key={note.id}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              variants={item}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="mb-3 flex justify-between">
                <div className="flex items-center">
                  <RiFileListLine className="mr-2 text-blue-500" />
                  <h3 className="font-medium text-gray-800">{note.title}</h3>
                </div>
                {note.isPublic && (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                    공개
                  </span>
                )}
              </div>
              
              <div className="mb-4 flex-1">
                <div className="mb-3 flex flex-wrap gap-1">
                  {note.tags && note.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {note.lecture?.mediaFile ? `오디오: ${note.lecture.mediaFile.fileName}` : '텍스트 노트'}
                </p>
              </div>
              
              <div className="mt-auto border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {format(new Date(note.updatedAt), 'PPP', { locale: ko })}
                  </span>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleEditNote(note.id)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-500"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <RiEdit2Line />
                    </motion.button>
                    <motion.button
                      onClick={() => handleViewNote(note.id)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-green-500"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <RiFileListLine />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteNote(note.id)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-500"
                      disabled={isDeleting}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <RiDeleteBin6Line />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <RiFileListLine className="h-8 w-8 text-gray-400" />
          </motion.div>
          <h3 className="mb-2 text-lg font-medium text-gray-800">아직 강의노트가 없습니다</h3>
          <p className="mb-4 text-center text-sm text-gray-500">
            첫 번째 강의노트를 만들어 학습 내용을 효율적으로 관리하세요.
          </p>
          <motion.button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-md bg-accent px-4 py-2 text-sm text-white hover:bg-accent/80"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            새 노트 만들기
          </motion.button>
        </motion.div>
      )}
      
      {/* 새 노트 생성 모달 */}
      {isCreateModalOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsCreateModalOpen(false)}
        >
          <motion.div 
            className="w-full max-w-lg rounded-lg bg-white p-6"
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold text-gray-800">새 강의노트 만들기</h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">강의 선택</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={newNote.lectureId}
                onChange={(e) => setNewNote({ ...newNote, lectureId: e.target.value })}
              >
                <option value="">강의를 선택하세요</option>
                {lectures?.pages?.flatMap(page => page.data).map((lecture) => (
                  <option key={lecture.id} value={lecture.id}>
                    {lecture.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">제목</label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-2"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">내용</label>
              <textarea
                className="h-32 w-full rounded-md border border-gray-300 p-2"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">태그</label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="태그를 쉼표로 구분하여 입력"
                value={newNote.tags.join(', ')}
                onChange={(e) =>
                  setNewNote({
                    ...newNote,
                    tags: e.target.value.split(',').map((tag) => tag.trim()),
                  })
                }
              />
            </div>
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-gray-300"
                  checked={newNote.isPublic}
                  onChange={(e) => setNewNote({ ...newNote, isPublic: e.target.checked })}
                />
                <span className="text-sm text-gray-700">공개 노트로 설정</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <motion.button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                취소
              </motion.button>
              <motion.button
                onClick={handleCreateNote}
                disabled={isCreating || !newNote.title}
                className={`rounded-md px-4 py-2 text-white ${
                  isCreating || !newNote.title
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                whileHover={!isCreating && newNote.title ? { scale: 1.05 } : {}}
                whileTap={!isCreating && newNote.title ? { scale: 0.95 } : {}}
              >
                {isCreating ? '생성 중...' : '생성하기'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 