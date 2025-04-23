'use client';

import { RiFileListLine, RiFileTextLine, RiFolder3Line } from 'react-icons/ri';

import Link from 'next/link';
import React from 'react';

export interface ISearchResult {
  id: string;
  title: string;
  path?: string;
  type: 'file' | 'folder' | 'document';
  description?: string;
}

interface ISearchResultsProps {
  results: ISearchResult[];
  isLoading: boolean;
  query: string;
  onResultClick?: (result: ISearchResult) => void;
}

const SearchResults = ({ results, isLoading, query, onResultClick }: ISearchResultsProps) => {
  // 검색 결과가 없을 때
  if (!isLoading && results.length === 0 && query) {
    return (
      <div className="absolute left-0 right-0 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg z-30">
        <div className="p-4 text-center text-gray-500">
          <p>검색 결과가 없습니다.</p>
        </div>
      </div>
    );
  }

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="absolute left-0 right-0 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg z-30">
        <div className="p-4 flex justify-center">
          <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">검색 중...</span>
        </div>
      </div>
    );
  }

  // 검색 결과가 있을 때
  if (results.length > 0) {
    return (
      <div className="absolute left-0 right-0 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg z-30">
        <div className="p-2">
          <div className="text-xs text-gray-500 p-2">
            &ldquo;{query}&rdquo;에 대한 검색 결과 ({results.length})
          </div>
          <ul>
            {results.map((result) => (
              <li key={result.id}>
                {result.path ? (
                  <Link href={result.path}>
                    <div 
                      className="flex items-start p-2 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => onResultClick && onResultClick(result)}
                    >
                      {getIconForType(result.type)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{result.title}</p>
                        {result.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{result.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div 
                    className="flex items-start p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                    onClick={() => onResultClick && onResultClick(result)}
                  >
                    {getIconForType(result.type)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">{result.title}</p>
                      {result.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{result.description}</p>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // 기본적으로는 아무것도 렌더링하지 않음
  return null;
};

// 검색 결과 유형에 따른 아이콘 반환
const getIconForType = (type: string) => {
  switch (type) {
    case 'file':
      return <RiFileListLine className="h-5 w-5 text-indigo-500" />;
    case 'folder':
      return <RiFolder3Line className="h-5 w-5 text-yellow-500" />;
    case 'document':
      return <RiFileTextLine className="h-5 w-5 text-blue-500" />;
    default:
      return <RiFileTextLine className="h-5 w-5 text-gray-500" />;
  }
};

export default SearchResults; 