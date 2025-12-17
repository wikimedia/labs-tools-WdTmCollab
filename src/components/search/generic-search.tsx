"use client";

import React, { useState, useRef, useEffect } from "react";
import FormInput from "@/src/components/ui/form-input";

// Helper for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Generic search item interface
export interface SearchItem {
  id: string;
  label: string;
  imageUrl?: string;
  description?: string;
  [key: string]: any; // Allow additional properties
}

// Generic search hook result interface
export interface SearchHookResult<T> {
  data?: T[];
  isLoading: boolean;
  isError: boolean;
}

interface GenericSearchProps<T extends SearchItem> {
  onSelect: (item: T | null) => void;
  placeholder?: string;
  initialValue?: string;
  useSearchHook: (query: string) => SearchHookResult<T>;
  renderItem?: (item: T) => React.ReactNode;
  getItemKey?: (item: T) => string;
  ariaLabel?: string;
  errorMessage?: string;
}

export default function GenericSearch<T extends SearchItem>({
  onSelect,
  placeholder = "Search...",
  initialValue = "",
  useSearchHook,
  renderItem,
  getItemKey,
  ariaLabel = "Search",
  errorMessage = "Error fetching results",
}: GenericSearchProps<T>) {
  const [query, setQuery] = useState<string>(initialValue);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(5);
  const [isFocused, setIsFocused] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (initialValue && !selectedItem) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  const debouncedQuery = useDebounce(query, 300);

  const shouldSearch =
    debouncedQuery.length > 2 &&
    (!selectedItem || debouncedQuery !== selectedItem.label);

  const {
    data: results = [],
    isLoading,
    isError,
  } = useSearchHook(shouldSearch ? debouncedQuery : "");

  useEffect(() => {
    setDisplayCount(5);
  }, [debouncedQuery]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 5, results.length));
  };

  const handleSelection = (item: T) => {
    setSelectedItem(item);
    setQuery(item.label);
    onSelect(item);
    setIsFocused(false);
  };

  const handleClearSelection = () => {
    setSelectedItem(null);
    setQuery("");
    onSelect(null);
    setDisplayCount(5);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const showDropdown =
    isFocused && !selectedItem && results.length > 0 && query.length > 2;

  // Default item renderer
  const defaultRenderItem = (item: T) => (
    <li
      key={getItemKey ? getItemKey(item) : item.id}
      className="p-4 border-b border-gray-100 last:border-none flex items-center space-x-4 cursor-pointer hover:bg-blue-50 transition-colors"
      onClick={() => handleSelection(item)}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.label}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-600 font-semibold text-lg">
            {item.label.charAt(0)}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-base text-gray-800">
          {item.label}
        </h3>
        {item.description && (
          <p className="text-sm text-gray-600">{item.description}</p>
        )}
      </div>
    </li>
  );

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="relative">
        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <FormInput
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onChange={(e) => {
            if (selectedItem) setSelectedItem(null);
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="pl-10"
          error={isError ? errorMessage : undefined}
        />

        {query.length > 0 && (
          <button
            onClick={handleClearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 -mr-3 p-3 z-10 text-gray-600 hover:text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-gray-100"
            type="button"
            aria-label="Clear search query"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          </button>
        )}
      </div>

      {showDropdown && (
        <ul
          ref={listRef}
          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
        >
          {isLoading && (
            <li className="p-4 text-center text-gray-600">Searching...</li>
          )}

          {results.slice(0, displayCount).map((item) =>
            renderItem ? renderItem(item) : defaultRenderItem(item)
          )}

          {results.length > displayCount && (
            <li className="p-4 text-center">
              <button
                onClick={handleLoadMore}
                className="text-blue-600 hover:underline font-medium"
              >
                Load More ({results.length - displayCount} remaining)
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
