'use client';

import React, { useRef, useState } from 'react';
import SearchResults, { ISearchResult } from './SearchResults';

import SearchBar from './SearchBar';
import { searchContent } from '@/actions/searchActions';

interface ISearchProps {
  onSearch?: (query: string) => void;
  onResultClick?: (result: ISearchResult) => void;
}

const Search = ({ onSearch, onResultClick }: ISearchProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 검색 처리 함수
  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setShowResults(true);
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    // 검색 로직 구현
    try {
      setIsLoading(true);
      
      // DB 검색 Server Action 호출
      const searchResults = await searchContent(searchQuery);
      
      // DB 검색 결과를 컴포넌트 검색 결과 타입으로 변환
      const formattedResults: ISearchResult[] = searchResults.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type as 'file' | 'folder' | 'document',
        path: item.path,
        description: item.description
      }));
      
      setResults(formattedResults);
      
      // 검색 완료 후 콜백 호출
      if (onSearch) {
        onSearch(searchQuery);
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 결과 항목 클릭 처리
  const handleResultClick = (result: ISearchResult) => {
    // 결과 클릭 이벤트 처리
    if (onResultClick) {
      onResultClick(result);
    }
    // 검색 결과 닫기
    setShowResults(false);
  };

  // 바깥 영역 클릭 시 결과 닫기 처리
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchContainerRef} className="relative">
      <SearchBar onSearch={handleSearch} />
      {showResults && (
        <SearchResults
          results={results}
          isLoading={isLoading}
          query={query}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  );
};

export default Search; 