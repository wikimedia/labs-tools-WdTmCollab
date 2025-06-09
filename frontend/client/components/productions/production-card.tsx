import Link from 'next/link';

interface ProductionCardProps {
  id: string;
  title: string;
  year: number | string;
  type: string;
  actorCount?: number;
}

export default function ProductionCard({
  id,
  title,
  year,
  type,
  actorCount,
}: ProductionCardProps) {
  return (
    <Link
      href={`/productions/${id}`}
      className='block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow'
    >
      <div className='p-4'>
        <h3 className='font-medium text-lg mb-1'>{title}</h3>
        <div className='flex justify-between text-sm text-gray-600'>
          <span>{year}</span>
          <span>{type}</span>
        </div>
        {actorCount !== undefined && (
          <div className='mt-3 text-sm'>
            <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
              {actorCount} actors
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

