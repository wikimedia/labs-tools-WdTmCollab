'use client';

import { useState } from 'react';
import Link from 'next/link';

import { endpoints } from '@/utils/endpoints';
import Header from '@/src/components/layout/header';
import SearchComponent from '@/src/components/searchComponent';

interface ProductionCardProps {
  id: string;
  title: string;
  year: number | string;
  type: string;
  actorCount?: number;
}
interface Production {
  title: string;
  description: string;
  image?: string | null;
  logo?: string | null;
  wikipedia?: string;
  publicationDate?: string;
}
interface Actor {
  id: string;
  label: string;
  description?: string;
  url: string;
  imageUrl?: string;
}
export default function ProductionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [productions, setProductions] = useState(mockProductions);

  const filteredProductions = productions.filter((production) =>
    production.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const [actor1, setActor1] = useState<Actor | null>(null);
  const [actor2, setActor2] = useState<Actor | null>(null);
  const [sharedCastings, setSharedCastings] = useState<Production[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSharedCastings = async () => {
    if (!actor1 || !actor2) {
      alert('Please select both actors.');
      return;
    }
    console.log(actor1, actor2);

    setLoading(true);

    setError(null);

    try {
      const response = await fetch(
        endpoints.productionsShared(actor1.id, actor2.id),
      );

      if (!response.ok) {
        throw new Error('Failed to fetch shared castings.');
      }

      const data: Production[] = await response.json();
      console.log(data);

      setSharedCastings(data);
    } catch (error) {
      setError('Error fetching shared castings.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>Shared Productions</h1>
        <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <SearchComponent onSelect={(actor: Actor) => setActor1(actor)} />
          <SearchComponent onSelect={(actor: Actor) => setActor2(actor)} />
        </div>
        <button
          onClick={fetchSharedCastings}
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Fetch Shared Productions'}
        </button>
        {sharedCastings.length > 0 && (
          <div className='mt-6'>
            <h2 className='text-xl font-bold'>Shared Productions</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
              {Array.from(
                new Map(
                  sharedCastings.map((prod: any) => [prod.id ? prod.id : prod.title, prod])
                ).values()
              ).map((production: any, idx: number) => (
                <div
                  key={production.id ? production.id : `${production.title}-${idx}`}
                  className='p-4 border rounded-lg shadow-md bg-white'
                >
                  {production.image && (
                    <img
                      src={production.image}
                      alt={production.title}
                      className='w-full h-40 object-cover rounded'
                    />
                  )}
                  <h3 className='text-lg font-medium mt-2'>
                    {production.title}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {production.description}
                  </p>
                  {production.wikipedia && (
                    <a
                      href={production.wikipedia}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 mt-2 block'
                    >
                      Wikipedia
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {sharedCastings.length === 0 && !loading && actor1 && actor2 && (
          <p className='mt-4 text-gray-600'>No shared productions found.</p>
        )}
        {error && <p className='text-red-500 mt-4'>{error}</p>}
      </div>
    </main>
  );
}

// Mock data
const mockProductions = [
  {
    id: '134773',
    title: 'Forrest Gump',
    year: 1994,
    type: 'Movie',
    actorCount: 15,
  },
  {
    id: '104257',
    title: 'Saving Private Ryan',
    year: 1998,
    type: 'Movie',
    actorCount: 12,
  },
  {
    id: '170222',
    title: 'Cast Away',
    year: 2000,
    type: 'Movie',
    actorCount: 8,
  },
  {
    id: '36657',
    title: 'The Green Mile',
    year: 1999,
    type: 'Movie',
    actorCount: 14,
  },
  {
    id: '223702',
    title: 'The Devil Wears Prada',
    year: 2006,
    type: 'Movie',
    actorCount: 10,
  },
  {
    id: '28574',
    title: 'Sophie\'s Choice',
    year: 1982,
    type: 'Movie',
    actorCount: 9,
  },
  {
    id: '399055',
    title: 'The Iron Lady',
    year: 2011,
    type: 'Movie',
    actorCount: 11,
  },
  {
    id: '123456',
    title: 'The Post',
    year: 2017,
    type: 'Movie',
    actorCount: 13,
  },
  {
    id: '234567',
    title: 'Mamma Mia! Here We Go Again',
    year: 2018,
    type: 'Movie',
    actorCount: 16,
  },
  {
    id: '456789',
    title: 'Catch Me If You Can',
    year: 2002,
    type: 'Movie',
    actorCount: 12,
  },
  {
    id: '678901',
    title: 'Philadelphia',
    year: 1993,
    type: 'Movie',
    actorCount: 10,
  },
  {
    id: '789012',
    title: 'Game of Thrones',
    year: 2011,
    type: 'TV Show',
    actorCount: 43,
  },
];
