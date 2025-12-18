import React, { useEffect, useState } from "react";

interface CoActor {
  actorId: string;
  name: string;
  description?: string;
  image?: string | null;
  sharedWorks?: number;
}

interface Props {
  actorId: string;
}

export default function CollaboratorList({ actorId }: Props) {
  const [results, setResults] = useState<CoActor[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(20);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!actorId) return;
    // reset on actor change
    setResults([]);
    setPage(1);
    setHasMore(false);
    fetchPage(1, true);
  }, [actorId]);

  async function fetchPage(pageToLoad: number, replace = false) {
    setLoading(true);
    setError(null);
    try {
      const url = `/actors/co-actors?actorId=${encodeURIComponent(actorId)}&page=${pageToLoad}&per_page=${perPage}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch co-actors (${res.status})`);
      }
      const data = await res.json();
      // Data shape: { results: CoActor[], pagination: { total, limit, offset, hasMore } }
      const pageResults: CoActor[] = data.results || [];
      const pagination = data.pagination || { total: null, limit: perPage, offset: (pageToLoad-1)*perPage, hasMore: false };

      setHasMore(Boolean(pagination.hasMore));
      setPage(pageToLoad);
      if (replace) setResults(pageResults);
      else setResults((prev) => [...prev, ...pageResults]);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const handleLoadMore = () => {
    if (loading) return;
    fetchPage(page + 1, false);
  };

  if (!actorId) return null;

  return (
    <div className="space-y-2">
      {results.length === 0 && !loading && <p className="text-sm text-gray-500">No collaborators found.</p>}
      <ul className="space-y-2">
        {results.map((c) => (
          <li key={c.actorId} className="p-3 bg-white rounded shadow-sm flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {c.image ? <img src={c.image} alt={c.name} /> : <span className="text-gray-600">{c.name.charAt(0)}</span>}
            </div>
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-500">Shared works: {c.sharedWorks ?? 0}</div>
            </div>
          </li>
        ))}
      </ul>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {hasMore && (
        <div className="text-center">
          <button onClick={handleLoadMore} disabled={loading} className="text-blue-600 hover:underline">
            {loading ? "Loading…" : "Load more collaborators"}
          </button>
        </div>
      )}
    </div>
  );
}
