import React, { useState, useEffect } from 'react';
import { endpoints } from '@/utils/endpoints';

interface Actor {
  id: string;
  label: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

interface SearchComponentProps {
  onSelect: (actor: any) => void;
}

export default function SearchComponent({ onSelect }: SearchComponentProps) {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Actor[]>([]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

  useEffect(() => {
    if (query.trim() === '' || selectedActor) {
      setResults([]);
      return;
    }

    const fetchActors = async () => {
      try {
        const response = await fetch(endpoints.actorSearch(query));
        const data: Actor[] = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    const debounce = setTimeout(fetchActors, 300);
    return () => clearTimeout(debounce);
  }, [query, selectedActor]);

  const handleSelection = (actor: Actor) => {
    setSelectedActor(actor);
    setQuery(actor.label);
    onSelect(actor);
  };

  const handleClearSelection = () => {
    setSelectedActor(null);
    setQuery('');
    onSelect(null);
  };

  return (
    <div className='w-full max-w-md mx-auto relative'>
      <div className='relative'>
        <svg
          className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          />
        </svg>

        <input
          type='text'
          placeholder='Search actors...'
          value={query}
          onChange={(e) => {
            if (selectedActor) {
              handleClearSelection();
            }
            setQuery(e.target.value);
          }}
          className='w-full p-3 pl-11 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition'
        />

        {selectedActor && (
          <button
            onClick={handleClearSelection}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>

      {!selectedActor && results.length > 0 && (
        <ul className='absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto'>
          {results.map((actor) => (
            <li
              key={actor.id}
              className='p-4 border-b border-gray-100 last:border-none flex items-center space-x-4 cursor-pointer hover:bg-blue-50 transition-colors'
              onClick={() => handleSelection(actor)}
            >
              <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0'>
                {actor.imageUrl ? (
                  <img
                    src={actor.imageUrl}
                    alt={actor.label}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span className='text-gray-500 font-semibold text-lg'>
                    {actor.label.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className='font-semibold text-base text-gray-800'>
                  {actor.label}
                </h3>
                <p className='text-sm text-gray-500'>ID: {actor.id}</p>
                {actor.description && (
                  <p className='text-sm text-gray-500'>{actor.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
