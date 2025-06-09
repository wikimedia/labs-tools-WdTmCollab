'use client';

import { useState } from 'react';
import Header from '@/client/components/layout/header';
import { endpoints } from '@/utils/endpoints';

interface Actor {
  id: string;
  name: string;
  description: string;
  image: string | null;
}

const movieMapping: Record<string, string> = {
  'Pulp Fiction': 'Q83495',
  'Django Unchained': 'Q15732802',
};

export default function SharedActorsFromMovies() {
  // Use movie names as state, with defaults matching the mapping keys.
  const [movie1Name, setMovie1Name] = useState('Pulp Fiction');
  const [movie2Name, setMovie2Name] = useState('Django Unchained');
  const [sharedActors, setSharedActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSharedActors = async () => {
    const movie1Id = movieMapping[movie1Name];
    const movie2Id = movieMapping[movie2Name];

    if (!movie1Id || !movie2Id) {
      alert('One or both movie names are not recognized.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = endpoints.sharedActors(movie1Id, movie2Id);
      const response = await fetch(url);
      console.log(movie1Id, movie2Id, response);
      if (!response.ok) {
        throw new Error('Failed to fetch shared actors.');
      }
      const data: Actor[] = await response.json();
      setSharedActors(data);
    } catch (err) {
      console.error(err);
      setError('Error fetching shared actors.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>Shared Actors from Movies</h1>
        <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='text'
            className='w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300'
            value={movie1Name}
            onChange={(e) => setMovie1Name(e.target.value)}
            placeholder='Enter first movie name'
          />
          <input
            type='text'
            className='w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300'
            value={movie2Name}
            onChange={(e) => setMovie2Name(e.target.value)}
            placeholder='Enter second movie name'
          />
        </div>
        <button
          onClick={fetchSharedActors}
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Fetch Shared Actors'}
        </button>
        {error && <p className='text-red-500 mt-4'>{error}</p>}
        {sharedActors.length > 0 && (
          <div className='mt-6'>
            <h2 className='text-xl font-bold'>Shared Actors</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
              {sharedActors.map((actor) => (
                <div
                  key={actor.id}
                  className='p-4 border rounded-lg shadow-md bg-white'
                >
                  {actor.image && (
                    <img
                      src={actor.image}
                      alt={actor.name}
                      className='w-full h-40 object-cover rounded'
                    />
                  )}
                  <h3 className='text-lg font-medium mt-2'>{actor.name}</h3>
                  {actor.description && (
                    <p className='text-sm text-gray-600'>{actor.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {sharedActors.length === 0 && !loading && movie1Name && movie2Name && (
          <p className='mt-4 text-gray-600'>No shared actors found.</p>
        )}
      </div>
    </main>
  );
}
