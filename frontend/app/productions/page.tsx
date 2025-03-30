'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProductionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [productions, setProductions] = useState(mockProductions);

  const filteredProductions = productions.filter(production => 
    production.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Productions</h1>
        
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search productions..."
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
          {filteredProductions.map(production => (
            <Link 
              key={production.id} 
              href={`/productions/${production.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{production.title}</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{production.year}</span>
                  <span>{production.type}</span>
                </div>
                <div className="mt-3 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {production.actorCount} actors
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

// Mock data
const mockProductions = [
  { id: '134773', title: 'Forrest Gump', year: 1994, type: 'Movie', actorCount: 15 },
  { id: '104257', title: 'Saving Private Ryan', year: 1998, type: 'Movie', actorCount: 12 },
  { id: '170222', title: 'Cast Away', year: 2000, type: 'Movie', actorCount: 8 },
  { id: '36657', title: 'The Green Mile', year: 1999, type: 'Movie', actorCount: 14 },
  { id: '223702', title: 'The Devil Wears Prada', year: 2006, type: 'Movie', actorCount: 10 },
  { id: '28574', title: 'Sophie\'s Choice', year: 1982, type: 'Movie', actorCount: 9 },
  { id: '399055', title: 'The Iron Lady', year: 2011, type: 'Movie', actorCount: 11 },
  { id: '123456', title: 'The Post', year: 2017, type: 'Movie', actorCount: 13 },
  { id: '234567', title: 'Mamma Mia! Here We Go Again', year: 2018, type: 'Movie', actorCount: 16 },
  { id: '456789', title: 'Catch Me If You Can', year: 2002, type: 'Movie', actorCount: 12 },
  { id: '678901', title: 'Philadelphia', year: 1993, type: 'Movie', actorCount: 10 },
  { id: '789012', title: 'Game of Thrones', year: 2011, type: 'TV Show', actorCount: 43 },
];