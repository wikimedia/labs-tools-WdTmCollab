"use client";

import React from "react";
import { useActorSearch, Actor } from "@/src/hooks/api/useActors";
import GenericSearch, { SearchItem } from "@/src/components/search/generic-search";

interface SearchComponentProps {
  onSelect: (actor: Actor | null) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchComponent({
  onSelect,
  placeholder = "Search actors...",
  initialValue = "",
}: SearchComponentProps) {
  return (
    <GenericSearch<Actor>
      onSelect={onSelect}
      placeholder={placeholder}
      initialValue={initialValue}
      useSearchHook={useActorSearch}
      ariaLabel="Search for actors"
      errorMessage="Error fetching actors"
    />
  );
}

