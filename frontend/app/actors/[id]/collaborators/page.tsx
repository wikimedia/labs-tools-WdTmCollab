'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/client/components/layout/header';
import CollaborationNetwork from '@/client/components/visualizations/collaboration-network';

export default function ActorCollaboratorsPage() {
  const params = useParams();
  const actorId = params.id as string;
  
  // In a real app, you would fetch this data from the API
  const actor = mockActors.find(a => a.id === actorId) || { 
    id: actorId, 
    name: 'Unknown Actor',
  };
  
  const collaborators = mockCollaborators[actorId as keyof typeof mockCollaborators] || [];

  return (
    <main>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/actors/${actorId}`} className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {actor.name}
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{actor.name}'s Collaborators</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Collaborator List</h2>
            <div className="space-y-4">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center">
                    <Link href={`/actors/${collaborator.id}`} className="font-medium hover:text-blue-600">
                      {collaborator.name}
                    </Link>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {collaborator.collaborationCount} collaborations
                    </span>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-600">Shared Productions:</h4>
                    <ul className="mt-1 text-sm">
                      {collaborator.sharedProductions.slice(0, 3).map(prod => (
                        <li key={prod.id}>
                          <Link href={`/productions/${prod.id}`} className="hover:text-blue-600">
                            {prod.title}
                          </Link>
                        </li>
                      ))}
                      {collaborator.sharedProductions.length > 3 && (
                        <li className="text-gray-500">
                          +{collaborator.sharedProductions.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Collaboration Network</h2>
            <div className="border rounded-lg bg-white h-[600px]">
              <CollaborationNetwork 
                actorId={actorId} 
                collaborators={collaborators} 
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Mock data
const mockActors = [
  { id: '38111', name: 'Tom Hanks' },
  { id: '17492', name: 'Meryl Streep' },
];

const mockCollaborators = {
  '38111': [
    {
      id: '17492',
      name: 'Meryl Streep',
      collaborationCount: 3,
      sharedProductions: [
        { id: '123456', title: 'The Post' },
        { id: '234567', title: 'Mamma Mia! Here We Go Again' },
        { id: '345678', title: 'Fictional Movie 3' },
      ]
    },
    {
      id: '42215',
      name: 'Leonardo DiCaprio',
      collaborationCount: 2,
      sharedProductions: [
        { id: '456789', title: 'Catch Me If You Can' },
        { id: '567890', title: 'Fictional Movie 5' },
      ]
    },
    {
      id: '28782',
      name: 'Denzel Washington',
      collaborationCount: 4,
      sharedProductions: [
        { id: '678901', title: 'Philadelphia' },
        { id: '789012', title: 'Fictional Movie 7' },
        { id: '890123', title: 'Fictional Movie 8' },
        { id: '901234', title: 'Fictional Movie 9' },
      ]
    },
    {
      id: '51329',
      name: 'Samuel L. Jackson',
      collaborationCount: 1,
      sharedProductions: [
        { id: '012345', title: 'Fictional Movie 10' },
      ]
    },
  ],
  '17492': [
    {
      id: '38111',
      name: 'Tom Hanks',
      collaborationCount: 3,
      sharedProductions: [
        { id: '123456', title: 'The Post' },
        { id: '234567', title: 'Mamma Mia! Here We Go Again' },
        { id: '345678', title: 'Fictional Movie 3' },
      ]
    },
    // More collaborators...
  ]
};