'use client';

import { useState } from 'react';
import Header from '@/client/components/layout/header';

export default function ComparePage() {
  const [actor1, setActor1] = useState('');
  const [actor2, setActor2] = useState('');
  const [results, setResults] = useState<any>(null);

  const handleCompare = () => {
    // In a real app, you would fetch this data from the API
    // For now, we'll use mock data
    if (actor1 && actor2) {
      setResults({
        actor1: mockActors.find(a => a.id === actor1),
        actor2: mockActors.find(a => a.id === actor2),
        sharedProductions: [
          { id: '123456', title: 'The Post', year: 2017 },
          { id: '234567', title: 'Mamma Mia! Here We Go Again', year: 2018 },
        ]
      });
    }
  };

  return (
    <main>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Compare Actors</h1>
        
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Actors to Compare</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Actor
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={actor1}
                onChange={(e) => setActor1(e.target.value)}
              >
                <option value="">Select an actor</option>
                {mockActors.map(actor => (
                  <option key={actor.id} value={actor.id}>{actor.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Actor
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={actor2}
                onChange={(e) => setActor2(e.target.value)}
              >
                <option value="">Select an actor</option>
                {mockActors.map(actor => (
                  <option key={actor.id} value={actor.id}>{actor.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleCompare}
              disabled={!actor1 || !actor2}
            >
              Compare
            </button>
          </div>
        </div>
        
        {results && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-xl font-semibold mb-4">
              Shared Productions between {results.actor1.name} and {results.actor2.name}
            </h2>
            
            {results.sharedProductions.length > 0 ? (
              <div className="space-y-4">
                {results.sharedProductions.map((production: any) => (
                  <div key={production.id} className="border rounded-lg p-4">
                    <div className="font-medium">{production.title}</div>
                    <div className="text-sm text-gray-500">{production.year}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No shared productions found.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Mock data
const mockActors = [
  { id: '38111', name: 'Tom Hanks' },
  { id: '17492', name: 'Meryl Streep' },
  { id: '42215', name: 'Leonardo DiCaprio' },
  { id: '39187', name: 'Viola Davis' },
  { id: '28782', name: 'Denzel Washington' },
  { id: '37917', name: 'Cate Blanchett' },
  { id: '51329', name: 'Samuel L. Jackson' },
  { id: '47981', name: 'Emma Thompson' },
];