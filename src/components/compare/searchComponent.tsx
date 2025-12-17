"use client";

import React from "react";
import { useMovieSearch, Movie } from "@/src/hooks/api/useProductSearch";
import GenericSearch from "@/src/components/search/generic-search";

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
  // Custom render function for movie items
  const renderMovieItem = (movie: Movie) => (
    <li
      key={movie?.id}
      className="p-4 border-b border-gray-100 last:border-none flex items-center space-x-4 cursor-pointer hover:bg-blue-50 transition-colors"
      onClick={() => onSelect(movie)}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
        {movie?.imageUrl ? (
          <img src={movie?.imageUrl} alt={movie?.label} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-600 font-semibold text-lg">{movie?.label?.charAt(0)}</span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-base text-gray-800">{movie?.label}</h3>
        <p className="text-sm text-gray-600">ID: {movie?.id}</p>
        {movie?.year && <p className="text-xs text-gray-400">{movie.year}</p>}
      </div>
    </li>
  );

  return (
    <GenericSearch<Movie>
      onSelect={onSelect}
      placeholder={placeholder || "Search movies..."}
      initialValue={initialValue}
      useSearchHook={useMovieSearch}
      renderItem={renderMovieItem}
      ariaLabel="Search for movies"
      errorMessage="Error fetching movies"
    />
  );
}
