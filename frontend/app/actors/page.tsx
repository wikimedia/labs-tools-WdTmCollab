'use client';

import { useState } from 'react';
import Header from '@/client/components/layout/header';
import ActorCard from '@/client/components/actors/actor-card';

export default function ActorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actors, setActors] = useState(mockActors);

  const filteredActors = actors.filter(actor => 
    actor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Actors</h1>
        
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search actors..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActors.map(actor => (
            <ActorCard 
              key={actor.id}
              id={actor.id}
              name={actor.name}
              collaborationCount={actor.collaborations}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

// Mock data
const mockActors = [
  { id: '38111', name: 'Tom Hanks', collaborations: 87 },
  { id: '17492', name: 'Meryl Streep', collaborations: 92 },
  { id: '42215', name: 'Leonardo DiCaprio', collaborations: 76 },
  { id: '39187', name: 'Viola Davis', collaborations: 68 },
  { id: '28782', name: 'Denzel Washington', collaborations: 81 },
  { id: '37917', name: 'Cate Blanchett', collaborations: 73 },
  { id: '51329', name: 'Samuel L. Jackson', collaborations: 104 },
  { id: '47981', name: 'Emma Thompson', collaborations: 65 },
  { id: '12345', name: 'Robert De Niro', collaborations: 95 },
  { id: '23456', name: 'Jennifer Lawrence', collaborations: 58 },
  { id: '34567', name: 'Brad Pitt', collaborations: 82 },
  { id: '45678', name: 'Scarlett Johansson', collaborations: 71 },
];