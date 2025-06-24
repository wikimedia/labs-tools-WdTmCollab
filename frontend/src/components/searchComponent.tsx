import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  const [actorId, setActorId] = useState<string>('');
  const [results, setResults] = useState<Actor[]>([]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const fetchActors = async () => {
      try {
        const response = await fetch(endpoints.actorSearch(query));
        const data: Actor[] = await response.json();
        console.log(data);

        setResults(data);
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    const debounce = setTimeout(fetchActors, 300);
    return () => clearTimeout(debounce);
  }, [query]);
  const handleSelection = (actor: Actor) => {
    setSelectedActor(actor);
    onSelect(actor);
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      <input
        type='text'
        placeholder='Search actors...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300'
      />
      <ul className='mt-2 bg-white border rounded-lg shadow-md'>
        {!selectedActor &&
          results.map((actor) => (
            <li
              key={actor.id}
              className={'p-2 border-b last:border-none flex items-center space-x-4 cursor-pointer'}
              onClick={() => handleSelection(actor)}
            >
              <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
                {actor.imageUrl ? (
                  <img src={actor.imageUrl} />
                ) : (
                  <span className='text-gray-500'>{actor.label.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className='font-medium text-lg'>{actor.label}</h3>
                <p className='text-sm text-gray-600'>ID: {actor.id}</p>
              </div>
            </li>
          ))}
      </ul>
      {selectedActor && (
        <div className='mt-4 p-4 border rounded-lg shadow-md bg-white'>
          <h2 className='text-xl font-bold'>Selected Actor</h2>
          <div className='flex items-center space-x-4 mt-2'>
            <div className='w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
              {selectedActor.imageUrl ? (
                <img src={selectedActor.imageUrl} />
              ) : (
                <span className='text-gray-500'>
                  {selectedActor.label.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className='text-lg font-medium'>{selectedActor.label}</h3>
              <p className='text-sm text-gray-600'>ID: {selectedActor.id}</p>
            </div>
          </div>
        </div>
      )}{' '}
    </div>
  );
}
