"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, AlertCircle } from "lucide-react";
import { useDebouncedValue } from "@/utils/debounce";
import { SkeletonRepeat, SkeletonRow } from "../ui/skeleton-loader";
import { Button } from "../ui/button";

export interface SearchItem {
  id: string;
  label: string;
  imageUrl?: string;
  description?: string;
  [key: string]: unknown;
}

export interface SearchHookResult<T> {
  data?: T[];
  isLoading: boolean;
  isError: boolean;
}

interface GenericSearchProps<T extends SearchItem> {
  onSelect: (item: T | null) => void;
  placeholder?: string;
  useSearchHook: (query: string) => SearchHookResult<T>;
  renderItem?: (item: T) => React.ReactNode;
}

export default function GenericSearch<T extends SearchItem>({
  onSelect,
  placeholder = "Search...",
  useSearchHook,
  renderItem,
}: GenericSearchProps<T>) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(query, 300);
  const shouldFetch = debouncedQuery.length > 2;

  const {
    data: results = [],
    isLoading,
    isError,
  } = useSearchHook(shouldFetch ? debouncedQuery : "");

  /** Ensure portal only renders on client */
  useEffect(() => {
    setMounted(true);
  }, []);

  /** Close on outside click */
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

  /** Position dropdown under input */
  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, [isOpen, query]);

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
    <>
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full h-14 pl-12 pr-12 rounded-xl border border-input bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring text-lg"
            aria-expanded={isOpen}
          />

          {query && (
            <Button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {mounted && isOpen && query.length > 0 &&
        createPortal(
          <div
            style={dropdownStyle}
            className="bg-popover text-popover-foreground rounded-xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
          >
            {query.length < 3 && (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Type at least 3 characters...
              </div>
            )}

            {shouldFetch && isLoading &&
              <SkeletonRepeat count={3}>
                <SkeletonRow />
              </SkeletonRepeat>
            }

            {shouldFetch && isError && !isLoading && (
              <div className="p-6 text-center text-destructive flex flex-col items-center">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>Failed to load results.</p>
              </div>
            )}

            {shouldFetch && !isLoading && !isError && results.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            )}

            {shouldFetch && !isLoading && results.length > 0 && (
              <ul className="max-h-[300px] overflow-y-auto py-2">
                {results.map((item) => (
                  <li key={item.id}>
                    {renderItem ? (
                      <div onClick={() => handleSelect(item)}>
                        {renderItem(item)}
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center p-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="font-medium text-muted-foreground uppercase">
                              {item.label.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="ml-4 min-w-0">
                          <p className="font-medium truncate">
                            {item.label}
                          </p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
