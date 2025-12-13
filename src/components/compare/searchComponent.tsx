import React, { useState, useEffect, useRef } from "react";
import { endpoints } from "@/utils/endpoints";
import FormInput from "@/src/components/ui/form-input";

interface Movie {
  id: string;
  label: string;
  description?: string;
  type: string;
  url: string;
  imageUrl?: string;
  year?: string;
  imageType: string;
}

interface SearchComponentProps {
  onSelect: (movie: Movie | null) => void;
  placeholder?: string;
}

export default function SearchComponent({ onSelect, placeholder }: SearchComponentProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(5); // Initial display count
  const [error, setError] = useState<string>("");
  const listRef = useRef<HTMLUListElement>(null); // Ref for the scrollable list

  useEffect(() => {
    // Reset displayCount when query changes or an Movie is selected/cleared
    if (query.trim() === "" || selectedMovie) {
      setResults([]);
      setDisplayCount(5); // Reset to initial display count
      setError(""); // Clear error
      return;
    }

    const fetchActors = async () => {
      try {
        const response = await fetch(endpoints.movieSearch(query));
        if (!response.ok) {
          throw new Error("Failed to fetch movies.");
        }
        const data: Movie[] = await response.json();
        setResults(data);
        setDisplayCount(5); // Ensure display count is reset when new results arrive
        setError(""); // Clear error on success
      } catch (error) {
        console.error("Error fetching movies:", error);
        setResults([]); // Clear results on error
        setError("Failed to fetch movies. Please try again.");
      }
    };

    const debounce = setTimeout(fetchActors, 300);
    return () => clearTimeout(debounce);
  }, [query, selectedMovie]);

  const handleLoadMore = () => {
    // Increase displayCount by 5, but not beyond the total number of results
    setDisplayCount((prevCount) => Math.min(prevCount + 5, results.length));
  };

  const handleSelection = (movie: Movie) => {
    setSelectedMovie(movie);
    setQuery(movie.label);
    onSelect(movie);
    setResults([]); // Clear results after selection
    setDisplayCount(5); // Reset display count
  };

  const handleClearSelection = () => {
    setSelectedMovie(null);
    setQuery("");
    onSelect(null);
    setResults([]); // Clear results
    setDisplayCount(5); // Reset display count
    setError(""); // Clear error
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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
          value={query}
          onChange={(e) => {
            if (selectedMovie) {
              handleClearSelection();
            }
            setQuery(e.target.value);
          }}
          placeholder={placeholder}
          aria-label="Search for movies"
          helperText="Type to search for movies..."
          error={error}
        />

        {selectedMovie && (
          <button
            onClick={handleClearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
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

      {!selectedMovie && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
        >
          {results.slice(0, displayCount).map(
            (
              movie // Slice results to limit display
            ) => (
              <li
                key={movie?.id}
                className="p-4 border-b border-gray-100 last:border-none flex items-center space-x-4 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => handleSelection(movie)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {movie?.imageUrl ? (
                    <img
                      src={movie?.imageUrl}
                      alt={movie?.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-semibold text-lg">
                      {movie?.label}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-base text-gray-800">
                    {movie?.label}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {movie?.id}</p>
                  {movie?.description && (
                    <p className="text-sm text-gray-500">
                      {movie?.description}
                    </p>
                  )}
                  {movie?.type && (
                    <p className="text-sm text-gray-500">{movie?.type}</p>
                  )}
                </div>
              </li>
            )
          )}
          {results.length > displayCount && ( // Show "Load More" button if there are more results
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
