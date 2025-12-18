"use client";
import React, { useState, useEffect, useRef } from "react";
import { endpoints } from "../../utils/endpoints";
import { useActorSearch, Actor } from "@/src/hooks/api/useActors";
import GenericSearch, { SearchItem } from "@/src/components/search/generic-search";

interface SearchComponentProps {
  onSelect: (actor: Actor | null) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchComponent({ onSelect }: SearchComponentProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Actor[]>([]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(20);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef<HTMLUListElement>(null);

  // prevent rapid-fire scroll-triggered loads
  const isFetchingRef = useRef(false);

  async function fetchPage(pageToLoad: number, replace = true) {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const url = `${endpoints.actorSearch(query)}&page=${pageToLoad}&per_page=${perPage}`;
      const res = await fetch(url);
      if (res.status === 204) {
        // no content
        if (replace) setResults([]);
        setHasMore(false);
        setPage(1);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Debug: log the raw response for troubleshooting
      console.debug("actors search response", data);

      // Support two response shapes:
      // 1) Paginated envelope: { results: Actor[], pagination: { ... } }
      // 2) Raw array: [ Actor, Actor, ... ]
      let pageResults: Actor[] = [];
      let pagination = { total: null as number | null, limit: perPage, offset: (pageToLoad - 1) * perPage, hasMore: false };

      if (Array.isArray(data)) {
        pageResults = data as Actor[];
        pagination.hasMore = pageResults.length === perPage;
      } else {
        pageResults = (data && data.results) ? (data.results as Actor[]) : [];
        if (data && data.pagination) {
          pagination = { ...pagination, ...data.pagination };
        } else {
          pagination.hasMore = pageResults.length === perPage;
        }
      }

      setHasMore(Boolean(pagination.hasMore));
      setPage(pageToLoad);
      if (replace) {
        setResults(pageResults);
        // reset scroll position for new query
        setTimeout(() => {
          if (listRef.current) listRef.current.scrollTop = 0;
        }, 0);
      } else {
        setResults((prev) => [...prev, ...pageResults]);
      }
    } catch (err) {
      console.error("Error fetching actors:", err);
      if (replace) setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedActor) return;

    if (query.trim() === "") {
      setResults([]);
      setPage(1);
      setHasMore(false);
      return;
    }

    const debounce = setTimeout(() => fetchPage(1, true), 300);
    return () => clearTimeout(debounce);
  }, [query, selectedActor]);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    fetchPage(page + 1, false);
  };

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const target = e.currentTarget;
    if (loading || !hasMore) return;
    // small buffer to trigger ahead of the bottom
    const remaining = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (remaining < 120 && !isFetchingRef.current) {
      isFetchingRef.current = true;
      // fetch next page; fetchPage will set loading, which we also check
      fetchPage(page + 1, false).finally(() => {
        // guard tiny delay to avoid double triggers
        setTimeout(() => {
          isFetchingRef.current = false;
        }, 200);
      });
    }
  };

  const handleSelection = (actor: Actor) => {
    setSelectedActor(actor);
    setQuery(actor.label);
    onSelect(actor);
    setResults([]);
    setHasMore(false);
    setPage(1);
  };

  const handleClearSelection = () => {
    setSelectedActor(null);
    setQuery("");
    onSelect(null);
    setResults([]);
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

        <input
          type="text"
          placeholder="Search actors..."
          value={query}
          onChange={(e) => {
            if (selectedActor) {
              handleClearSelection();
            }
            setQuery(e.target.value);
          }}
          className="w-full p-3 pl-11 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />

        {selectedActor && (
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

      {!selectedActor && results.length > 0 && (
        <ul
          ref={listRef}
          onScroll={handleScroll}
          role="listbox"
          aria-label="Actor search results"
          className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
        >
          <li className="p-2 text-xs text-gray-500 border-b border-gray-100">
            Page {page} · hasMore: {String(hasMore)} · results: {results.length}
          </li>
          {results.map((actor) => (
            <li
              key={actor.id}
              className="p-4 border-b border-gray-100 last:border-none flex items-center space-x-4 cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => handleSelection(actor)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                {actor.imageUrl ? (
                  <img src={actor.imageUrl} alt={actor.label} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 font-semibold text-lg">{actor.label.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-base text-gray-800">{actor.label}</h3>
                <p className="text-sm text-gray-500">ID: {actor.id}</p>
                {actor.description && <p className="text-sm text-gray-500">{actor.description}</p>}
              </div>
            </li>
          ))}
          {/* infinite-scroll will load more when the user scrolls near bottom */}
          {hasMore && (
            <li className="p-3 text-center border-t border-gray-100">
              <button
                onClick={() => handleLoadMore()}
                className="text-blue-600 hover:underline font-medium"
                disabled={loading}
              >
                {loading ? "Loading…" : "Load more"}
              </button>
            </li>
          )}
        </ul>
      )}
      {!selectedActor && !loading && query.trim() !== "" && results.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-sm text-gray-500">
          No results found.
        </div>
      )}
    </div>
  );
}

