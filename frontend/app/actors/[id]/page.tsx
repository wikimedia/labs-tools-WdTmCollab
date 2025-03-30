'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ActorDetailPage() {
  const params = useParams();
  const actorId = params.id as string;
  
  // In a real app, you would fetch this data from the API
  const actor = mockActors.find(a => a.id === actorId) || { 
    id: actorId, 
    name: 'Unknown Actor',
    bio: 'No biography available',
    productions: []
  };

  return (
    <main>      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/actors" className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Actors
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
                {actor.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{actor.name}</h1>
                <p className="text-gray-600 mb-4">{actor.bio}</p>
                
                <div className="flex space-x-4">
                  <Link 
                    href={`/actors/${actorId}/collaborators`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Collaborators
                  </Link>
                  <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Add to Compare
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t">
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">Productions</h2>
              
              {actor.productions && actor.productions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {actor.productions.map(production => (
                    <Link 
                      key={production.id} 
                      href={`/productions/${production.id}`}
                      className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium">{production.title}</div>
                      <div className="text-sm text-gray-500">{production.year}</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No productions found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Mock data
const mockActors = [
  { 
    id: '38111', 
    name: 'Tom Hanks', 
    bio: 'Thomas Jeffrey Hanks is an American actor and filmmaker. Known for both his comedic and dramatic roles, he is one of the most popular and recognizable film stars worldwide.',
    productions: [
      { id: '134773', title: 'Forrest Gump', year: 1994 },
      { id: '104257', title: 'Saving Private Ryan', year: 1998 },
      { id: '170222', title: 'Cast Away', year: 2000 },
      { id: '36657', title: 'The Green Mile', year: 1999 },
    ]
  },
  { 
    id: '17492', 
    name: 'Meryl Streep', 
    bio: 'Mary Louise "Meryl" Streep is an American actress. Often described as "the best actress of her generation", Streep is particularly known for her versatility and accent adaptability.',
    productions: [
      { id: '223702', title: 'The Devil Wears Prada', year: 2006 },
      { id: '28574', title: 'Sophie\'s Choice', year: 1982 },
      { id: '399055', title: 'The Iron Lady', year: 2011 },
    ]
  },
];