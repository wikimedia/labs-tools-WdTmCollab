'use client';
import React, { useState } from 'react';
import Header from '@/src/components/layout/header';
import SearchComponent from '@/src/components/searchComponent';
import { endpoints } from '@/utils/endpoints';
interface Actor {
  id: string;
  label: string;
  description?: string;
  url: string;
  image?: string;
  sharedWorks?: number;
  name: string;
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

  return (
    <main>
      <Header />

      <div className='min-h-screen bg-slate-50 flex flex-col items-center pt-16 px-4'>
        <div className='w-full max-w-5xl bg-white shadow-lg rounded-xl p-8 space-y-6'>
          <h1 className='text-4xl font-bold text-center text-gray-800'>
            Find Actor Collaborations
          </h1>
          <p className='text-center text-gray-500 text-lg'>
            Start by searching for an actor to see who they frequently work
            with.
          </p>

          <div className='space-y-4'>
            <SearchComponent onSelect={(actor: Actor) => setActor(actor)} />

            {actor && (
              <div className='flex justify-center pt-2'>
                <button
                  onClick={fetchCoActors}
                  className='w-full max-w-md px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:opacity-60 disabled:scale-100'
                  disabled={loading}
                >
                  {loading ? 'Searching...' : `Find ${actor.label}'s Co-Actors`}
                </button>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className='mt-8 text-center'>
            <p className='text-gray-600'>Loading collaborations...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className='w-full max-w-5xl mt-12'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
              Collaborators of{' '}
              <span className='text-blue-600'>{actor?.label}</span>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {results.map((coActor) => (
                <div
                  key={coActor.id}
                  className='flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300'
                >
                  <img
                    src={
                      coActor.image ||
                      `https://ui-avatars.com/api/?name=${coActor.name.replace(
                        /\s/g,
                        '+'
                      )}&background=random`
                    }
                    alt={coActor.name}
                    className='w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg mb-4'
                  />
                  <h3 className='text-lg font-bold text-gray-900 text-center'>
                    {coActor.name}
                  </h3>
                  {coActor.description && (
                    <p className='text-sm text-gray-500 text-center mt-1'>
                      {coActor.description}
                    </p>
                  )}
                  {coActor.sharedWorks !== undefined && (
                    <span className='mt-4 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full'>
                      {coActor.sharedWorks} Collaborations
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && actor && (
          <p className='mt-8 text-center text-gray-600'>
            No co-actors found for {actor.label}.
          </p>
        )}
        {error && (
          <p className='mt-8 text-center text-red-600 bg-red-100 p-4 rounded-lg'>
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
