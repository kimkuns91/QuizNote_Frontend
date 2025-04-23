'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
  variant?: 'default' | 'compact';
}

export default function MarkdownPreview({ 
  content, 
  variant = 'default' 
}: MarkdownPreviewProps) {
  if (!content) {
    return (
      <p className="text-gray-400 italic">내용을 입력하면 여기에 미리보기가 표시됩니다.</p>
    );
  }

  return (
    <div className={`prose ${variant === 'compact' ? 'prose-sm' : 'prose-lg'} max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-indigo-600`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({...props}) => <h1 className="text-2xl font-bold my-5 border-b border-gray-100 pb-2" {...props} />,
          h2: ({...props}) => <h2 className="text-xl font-bold my-4 text-indigo-800" {...props} />,
          h3: ({...props}) => <h3 className="text-lg font-bold my-3 text-gray-800" {...props} />,
          h4: ({...props}) => <h4 className="text-base font-bold my-2 text-gray-700" {...props} />,
          h5: ({...props}) => <h5 className="text-sm font-bold my-1 text-gray-700" {...props} />,
          h6: ({...props}) => <h6 className="text-xs font-bold my-1 text-gray-700" {...props} />,
          ul: ({...props}) => <ul className="list-disc pl-6 my-4 space-y-2" {...props} />,
          ol: ({...props}) => <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />,
          li: ({...props}) => <li className="my-1" {...props} />,
          p: ({...props}) => <p className="my-3 text-gray-700 leading-relaxed" {...props} />,
          blockquote: ({...props}) => <blockquote className="border-l-4 border-l-indigo-200 pl-4 italic my-4 text-gray-600 bg-gray-50 py-2 rounded-r-sm" {...props} />,
          code: ({...props}) => <code className="bg-gray-50 text-indigo-600 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
          pre: ({...props}) => <pre className="bg-gray-800 text-gray-50 p-4 rounded-md my-4 overflow-x-auto" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 