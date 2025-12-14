"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMovieSearch, Movie } from "@/src/hooks/api/useProductSearch";
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

interface SearchComponentProps {
  onSelect: (movie: Movie | null) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchComponent({
  onSelect,
  placeholder,
  initialValue = ""
}: SearchComponentProps) {
  const [query, setQuery] = useState<string>(initialValue);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(5);
  const [isFocused, setIsFocused] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (initialValue && !selectedMovie) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  const debouncedQuery = useDebounce(query, 300);

  const isSearchEnabled = debouncedQuery.length > 2 && (!selectedMovie || debouncedQuery !== selectedMovie.label);

  const {
    data: results = [],
    isLoading,
    isError // Added isError to destructuring
  } = useMovieSearch(isSearchEnabled ? debouncedQuery : "");

  useEffect(() => {
    setDisplayCount(5);
  }, [results]);

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 5, results.length));
  };

  const handleSelection = (movie: Movie) => {
    setSelectedMovie(movie);
    setQuery(movie.label);
    onSelect(movie);
    setIsFocused(false);
  };

  const handleClearSelection = () => {
    setSelectedMovie(null);
    setQuery("");
    onSelect(null);
    setDisplayCount(5);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const showDropdown = isFocused && !selectedMovie && results.length > 0 && query.length > 2;

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <FormInput
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onChange={(e) => {
            if (selectedMovie) setSelectedMovie(null);
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          placeholder={placeholder || "Search movies..."}
          aria-label="Search for movies"
          // Add padding-left (pl-10) so text doesn't overlap the icon
          className="pl-10"
          // Fix: map isError boolean to string or undefined
          error={isError ? "Error fetching movies" : undefined}
        />

        {query.length > 0 && (
          <button
            onClick={handleClearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 z-10"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <ul
          ref={listRef}
          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
        >
          {results.slice(0, displayCount).map((movie) => (
            <li
              key={movie?.id}
              className="p-4 border-b border-gray-100 last:border-none flex items-center space-x-4 cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => handleSelection(movie)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                {movie?.imageUrl ? (
                  <img src={movie?.imageUrl} alt={movie?.label} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 font-semibold text-lg">{movie?.label?.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-base text-gray-800">{movie?.label}</h3>
                <p className="text-sm text-gray-500">ID: {movie?.id}</p>
                {movie?.year && <p className="text-xs text-gray-400">{movie.year}</p>}
              </div>
            </li>
          ))}
          {results.length > displayCount && (
            <li className="p-4 text-center">
              <button onClick={handleLoadMore} className="text-blue-600 hover:underline font-medium">
                Load More ({results.length - displayCount} remaining)
              </button>
            </li>
          )}
        </ul>
      )}
      {isLoading && isFocused && <div className="absolute top-full w-full p-2 text-center text-sm text-gray-500">Searching...</div>}
    </div>
  );
}