'use client';

import { RiArrowLeftLine, RiBookmarkLine, RiDeleteBin6Line, RiEdit2Line } from 'react-icons/ri';
import { useDeleteLectureNote, useLectureNote } from '@/hooks/useLectureNotes';

import AudioPlayer from '@/components/audio/AudioPlayer';
import MarkdownPreview from '@/components/MarkdownPreview';
import { formatDate } from '@/lib/date';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';

export default function NoteDetailPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const router = useRouter();
  const { data: note, isLoading, isError } = useLectureNote(noteId);
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteLectureNote();

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    if (note) {
      console.log('Note Data:', note);
      console.log('Media File:', note.lecture?.mediaFile);
      if (note.lecture?.mediaFile) {
        console.log('Media File ID:', note.lecture.mediaFile.id);
      } else {
        console.log('미디어 파일이 없습니다.');
      }
    }
  }, [note]);

  const handleDelete = () => {
    if (window.confirm('정말로 이 강의노트를 삭제하시겠습니까?')) {
      deleteNote(noteId, {
        onSuccess: () => {
          toast.success('강의노트가 삭제되었습니다.');
          router.push('/notes');
        },
        onError: (error) => {
          toast.error(error.message);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">강의노트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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
          <p className="mb-4 text-red-600">강의노트를 불러오는데 실패했습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 transition-colors hover:text-gray-800"
            >
              <RiArrowLeftLine className="mr-2 h-5 w-5" />
              <span className="text-sm font-medium">뒤로가기</span>
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/notes/${note.id}/edit`)}
                className="rounded-full p-2 text-gray-500 bg-white shadow-sm hover:bg-blue-50 hover:text-blue-500 transition-all"
                aria-label="노트 수정"
              >
                <RiEdit2Line size={18} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-full p-2 text-gray-500 bg-white shadow-sm hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
                aria-label="노트 삭제"
              >
                <RiDeleteBin6Line size={18} />
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl border-l-4 border-l-indigo-500 border-r border-t border-b border-gray-200 bg-white p-6 shadow-md">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-50 opacity-40"></div>
            <div className="relative">
              <div className="flex items-center">
                <RiBookmarkLine className="mr-3 h-5 w-5 text-indigo-500" />
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{note.title}</h1>
              </div>
              <p className="mt-2 text-sm text-gray-500 font-light">
                {formatDate(note.updatedAt)}
              </p>
              
              {/* 태그 - 헤더 내부로 이동 */}
              {note.tags && note.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 shadow-sm transition-transform hover:scale-105"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 미디어 플레이어 - 연결된 강의에 오디오 파일이 있는 경우 */}
        {note.lecture?.mediaFile && (
          <div className="mb-8">
            <AudioPlayer 
              audioId={note.lecture.mediaFile.id}
              fileName={note.lecture.mediaFile.fileName}
              showDebugInfo={process.env.NODE_ENV === 'development'}
            />
          </div>
        )}

        {/* 내용 */}
        <div className="mb-10 rounded-xl border-l-4 border-l-indigo-300 border-t border-r border-b border-gray-200 bg-white p-7 shadow-md">
          <MarkdownPreview content={note.content} />
        </div>

        {/* 섹션 */}
        {note.sections && note.sections.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">섹션</h2>
            <div className="space-y-8">
              {note.sections.map((section) => (
                <div 
                  key={section.id} 
                  className="rounded-xl border-l-4 border-l-amber-400 border-t border-r border-b border-gray-200 bg-white p-6 shadow-md transition-all hover:shadow-lg"
                >
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    {section.title}
                  </h3>
                  <MarkdownPreview content={section.content} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
