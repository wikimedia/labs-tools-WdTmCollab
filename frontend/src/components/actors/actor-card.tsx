import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

interface ActorCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  collaborationCount?: number;
}

export default function ActorCard({
  id,
  name,
  imageUrl,
  collaborationCount,
}: ActorCardProps) {
  useEffect(() => {
    console.log(id, name);
  }, []);
  //function extractWikidataId(url: string) {
  //  console.log(url);
  //
  //  const match = url.match(/Q\d+/);
  //  return match ? match[0] : null;
  //}
  return (
    <Link href={`/actors/${id}`} className='block'>
      <div className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex items-center space-x-4'>
        <div className='relative w-16 h-16 rounded-full overflow-hidden bg-gray-200'>
          {imageUrl ? (
            <img src={imageUrl} alt={name} />
          ) : (
            <div className='flex items-center justify-center w-full h-full text-gray-500'>
              {name}
              {id}
            </div>
          )}
        </div>
        <div>
          <h3 className='font-medium text-lg'>{name}</h3>
          {collaborationCount !== undefined && (
            <p className='text-sm text-gray-600'>
              {collaborationCount} collaboration
              {collaborationCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {collaborationCount !== undefined && (
          <p className='text-sm text-gray-600'>
            {collaborationCount} collaboration{collaborationCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </Link>
  );
}