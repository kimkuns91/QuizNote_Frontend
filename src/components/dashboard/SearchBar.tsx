'use client';

import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { RiSearchLine } from 'react-icons/ri';

interface ISearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = '파일 또는 문서 검색' }: ISearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 단축키로 검색창 포커스
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Command(Meta) + K 단축키로 검색창 포커스
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 엔터 키로 검색 실행
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch();
    }
  };

  // 검색 실행 함수
  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="relative rounded-md">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {}}
        onBlur={() => {}}
        placeholder={placeholder}
        className="w-80 rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <RiSearchLine className="h-4 w-4 text-gray-400" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <span className="rounded-sm bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">⌘K</span>
      </div>
    </div>
  );
};

export default SearchBar; 