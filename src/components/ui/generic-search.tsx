"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Loader2, AlertCircle } from "lucide-react";
import { useDebouncedValue } from "@/utils/debounce";
import { usePaginatedSearch } from "@/src/hooks/usePaginatedSearch";

export interface SearchItem {
  id: string;
  label: string;
  imageUrl?: string | null;
  description?: string | null;
}

export interface SearchHookResult<T> {
  data?: T[];
  isLoading: boolean;
  isError: boolean;
}

interface GenericSearchProps<T extends SearchItem> {
  onSelect: (item: T | null) => void;
  placeholder?: string;
  initialValue?: string;
  useSearchHook?: (query: string) => SearchHookResult<T>;
  renderItem?: (item: T) => React.ReactNode;
  className?: string;
  enablePagination?: boolean;
  endpoint?: (query: string) => string;
  queryKey?: string[];
}

export default function GenericSearch<T extends SearchItem>({
  onSelect,
  placeholder = "Search...",
  initialValue = "",
  useSearchHook,
  renderItem,
  className,
  enablePagination = false,
  endpoint,
  queryKey = [],
}: GenericSearchProps<T>) {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setQuery(initialValue || "");
  }, [initialValue]);

  const debouncedQuery = useDebouncedValue(query, 300);
  const shouldFetch = debouncedQuery.length > 2;

  // Conditionally use paginated or regular search
  const searchResult = enablePagination
    ? usePaginatedSearch({
      query: shouldFetch ? debouncedQuery : "",
      endpoint: endpoint!,
      queryKey,
      enabled: shouldFetch,
    })
    : useSearchHook!(shouldFetch ? debouncedQuery : "");

  let results: T[] = [];
  let isLoading = false;
  let isError = false;
  let hasNextPage = false;
  let isFetchingNextPage = false;
  let fetchNextPage: () => void = () => { };

  if (enablePagination) {
    const paginatedResult = searchResult as ReturnType<typeof usePaginatedSearch>;
    results = paginatedResult.data?.pages.flatMap((page: any) => page.results) || [];
    isLoading = paginatedResult.isLoading;
    isError = paginatedResult.isError;
    hasNextPage = paginatedResult.hasNextPage;
    isFetchingNextPage = paginatedResult.isFetchingNextPage;
    fetchNextPage = paginatedResult.fetchNextPage;
  } else {
    const regularResult = searchResult as SearchHookResult<T>;
    results = regularResult.data || [];
    isLoading = regularResult.isLoading;
    isError = regularResult.isError;
  }

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    if (!enablePagination || !hasNextPage || isFetchingNextPage) return;
    const target = e.currentTarget;
    const remaining = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (remaining < 200) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: T) => {
    setQuery(item.label);
    setIsOpen(false);
    onSelect(item);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    onSelect(null);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-2xl mx-auto ${className || ""}`}
    >
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full h-14 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow overflow-hidden z-10">
        <div className="pl-5 pr-3 text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="flex-grow h-full outline-none text-gray-900 placeholder:text-gray-400 text-lg bg-transparent"
        />

        {query && (
          <button
            onClick={handleClear}
            className="p-3 mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {query.length < 3 && (
            <div className="p-4 text-sm text-gray-500 text-center">
              Type at least 3 characters...
            </div>
          )}

          {shouldFetch && isLoading && (
            <div className="p-4 flex justify-center items-center text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Searching...</span>
            </div>
          )}

          {shouldFetch && isError && !isLoading && (
            <div className="p-4 text-center text-red-500 flex flex-col items-center">
              <AlertCircle className="w-6 h-6 mb-1" />
              <span className="text-sm">Unable to load results.</span>
            </div>
          )}

          {shouldFetch && !isLoading && !isError && results.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}

          {shouldFetch && !isLoading && results.length > 0 && (
            <ul
              ref={listRef}
              className="max-h-64 overflow-y-auto custom-scrollbar"
              onScroll={handleScroll}
            >
              {results.map((item) => (
                <li key={item.id}>
                  {renderItem ? (
                    <div onClick={() => handleSelect(item)}>
                      {renderItem(item)}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center px-5 py-3 hover:bg-gray-50 transition-colors text-left group"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Search className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      <div className="ml-4 flex-grow min-w-0">
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-500 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </button>
                  )}
                </li>
              ))}
              {enablePagination && hasNextPage && (
                <li className="h-4"></li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}