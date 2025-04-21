'use client';

import { RiArrowLeftLine, RiDeleteBin6Line, RiEdit2Line } from 'react-icons/ri';
import { useDeleteLectureNote, useLectureNote } from '@/hooks/useLectureNotes';

import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import remarkGfm from 'remark-gfm';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';

export default function NoteDetailPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const router = useRouter();
  const { data: note, isLoading, isError } = useLectureNote(noteId);
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteLectureNote();

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">강의노트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center text-gray-600 transition-colors hover:text-gray-800"
          >
            <RiArrowLeftLine className="mr-2 h-5 w-5" />
            뒤로가기
          </button>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{note.title}</h1>
              <p className="mt-2 text-sm text-gray-500">
                {format(new Date(note.updatedAt), 'PPP', { locale: ko })}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/notes/${note.id}/edit`)}
                className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              >
                <RiEdit2Line className="mr-2 h-5 w-5" />
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                <RiDeleteBin6Line className="mr-2 h-5 w-5" />
                삭제
              </button>
            </div>
          </div>
        </div>

        {/* 태그 */}
        {note.tags && note.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 내용 */}
        <div className="mb-12 rounded-lg bg-white p-6 shadow-sm">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
                h2: ({...props}) => <h2 className="text-2xl font-bold my-3" {...props} />,
                h3: ({...props}) => <h3 className="text-xl font-bold my-2" {...props} />,
                h4: ({...props}) => <h4 className="text-lg font-bold my-2" {...props} />,
                h5: ({...props}) => <h5 className="text-base font-bold my-1" {...props} />,
                h6: ({...props}) => <h6 className="text-sm font-bold my-1" {...props} />
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* 섹션 */}
        {note.sections && note.sections.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">섹션</h2>
            <div className="space-y-6">
              {note.sections.map((section) => (
                <div 
                  key={section.id} 
                  className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
                        h2: ({...props}) => <h2 className="text-2xl font-bold my-3" {...props} />,
                        h3: ({...props}) => <h3 className="text-xl font-bold my-2" {...props} />,
                        h4: ({...props}) => <h4 className="text-lg font-bold my-2" {...props} />,
                        h5: ({...props}) => <h5 className="text-base font-bold my-1" {...props} />,
                        h6: ({...props}) => <h6 className="text-sm font-bold my-1" {...props} />
                      }}
                    >
                      {section.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
