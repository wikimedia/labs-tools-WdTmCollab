'use client';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import Header from '@/src/components/layout/header';
import ActorCard from '@/src/components/actors/actor-card';
import SearchComponent from '@/src/components/searchComponent';
import { endpoints } from '@/utils/endpoints';
interface Actor {
  id: string;
  name: string;
  description?: string;
  url: string;
  image?: string;
  sharedWorks?: number;
}
export default function ActorsPage() {
  const [actor, setActor] = useState<Actor | null>(null);
  const [results, setResults] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchCoActors = async () => {
    if (!actor) {
      alert('Please select an actor first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoints.co_ActorSearch(actor.id));
      if (!response.ok) {
        throw new Error('Failed to fetch actors.');
      }
      const data: Actor[] = await response.json();
      setResults(data);
    } catch (error) {
      setError('Error fetching actors.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  function extractWikidataId(url: string) {
    const match = url.match(/Q\d+/);
    return match ? match[0] : null;
  }
  return (
    <main>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Actors
          </h1>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <SearchComponent onSelect={(actor: Actor) => setActor(actor)} />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={fetchCoActors}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Fetch Co-Actors'}
            </button>
          </div>
          {results.length > 0 && (
            <div className="pt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Co-Actors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((coActor) => (
                  <div
                    key={coActor.id}
                    className="flex flex-col items-center bg-gray-100 rounded-lg p-6 shadow"
                  >
                    {coActor.image && (
                      <img
                        src={coActor.image}
                        alt={coActor.name}
                        className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 shadow-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {coActor.name}
                    </h3>
                    {coActor.description && (
                      <p className="text-sm text-gray-600 mb-2 text-center">
                        {coActor.description}
                      </p>
                    )}
                    {coActor.sharedWorks !== undefined && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        Collaborations: {coActor.sharedWorks}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {results.length === 0 && !loading && actor && (
            <p className="text-center text-gray-600">No co-actors found.</p>
          )}
          {error && <p className="text-center text-red-500">{error}</p>}
        </div>
      </div>
    </main>
  );
}
