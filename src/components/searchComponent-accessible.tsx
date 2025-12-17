import React, { useState, useEffect, useRef } from "react";
import { endpoints } from "@/utils/endpoints";

interface Actor {
  id: string;
  label: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

interface SearchComponentProps {
  onSelect: (actor: Actor | null) => void;
}

export default function SearchComponent({ onSelect }: SearchComponentProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Actor[]>([]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(5);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim() === "" || selectedActor) {
      setResults([]);
      setDisplayCount(5);
      return;
    }

    const fetchActors = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(endpoints.actorSearch(query));
        if (!response.ok) {
          throw new Error("Failed to fetch actors.");
        }
        const data: Actor[] = await response.json();
        setResults(data);
        setDisplayCount(5);
      } catch (error) {
        console.error("Error fetching actors:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchActors, 300);
    return () => clearTimeout(debounce);
  }, [query, selectedActor]);

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 5, results.length));
  };

  const handleSelection = (actor: Actor) => {
    setSelectedActor(actor);
    setQuery(actor.label);
    onSelect(actor);
    setResults([]);
    setDisplayCount(5);
  };

  const handleClearSelection = () => {
    setSelectedActor(null);
    setQuery("");
    onSelect(null);
    setResults([]);
    setDisplayCount(5);
  };

  return (
    <div className="w-full max-w-md mx-auto relative" role="search">
      <label htmlFor="actor-search" className="sr-only">
        Search for actors by name
      </label>
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          ref={inputRef}
          id="actor-search"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={results.length > 0 && !selectedActor}
          aria-controls="actor-search-results"
          aria-label="Search for actors by name"
          placeholder="Search actors..."
          value={query}
          onChange={(e) => {
            if (selectedActor) {
              handleClearSelection();
            }
            setQuery(e.target.value);
          }}
          className="w-full p-3 pl-11 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-sm transition"
        />

        {selectedActor && (
          <button
            onClick={handleClearSelection}
            aria-label="Clear selected actor"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              focusable="false"
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

        {isSearching && !selectedActor && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            role="status"
            aria-live="polite"
          >
            <span className="sr-only">Searching...</span>
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {!selectedActor && results.length > 0 && (
        <>
          <div role="status" aria-live="polite" className="sr-only">
            {results.length} {results.length === 1 ? "result" : "results"}{" "}
            found
          </div>
          <ul
            ref={listRef}
            id="actor-search-results"
            role="listbox"
            aria-label="Search results"
            className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
          >
            {results.slice(0, displayCount).map((actor) => (
              <li
                key={actor.id}
                role="option"
                aria-selected={false}
                tabIndex={0}
                className="p-4 border-b border-gray-100 last:border-none flex items-center space-x-4 cursor-pointer hover:bg-blue-50 focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-colors"
                onClick={() => handleSelection(actor)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelection(actor);
                  }
                }}
              >
                <div
                  className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  {actor.imageUrl ? (
                    <img
                      src={actor.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-semibold text-lg">
                      {actor.label.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-base text-gray-800">
                    {actor.label}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {actor.id}</p>
                  {actor.description && (
                    <p className="text-sm text-gray-600">{actor.description}</p>
                  )}
                </div>
              </li>
            ))}
            {results.length > displayCount && (
              <li className="p-4 text-center" role="presentation">
                <button
                  onClick={handleLoadMore}
                  aria-label={`Load ${Math.min(
                    5,
                    results.length - displayCount
                  )} more results. ${results.length - displayCount
                    } results remaining`}
                  className="text-blue-600 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1"
                >
                  Load More ({results.length - displayCount} remaining)
                </button>
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
