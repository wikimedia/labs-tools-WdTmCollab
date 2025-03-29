import Link from 'next/link';

interface ActorCardProps {
  id: string;
  name: string;
  collaborationCount?: number;
}

export default function ActorCard({ id, name, collaborationCount }: ActorCardProps) {
  return (
    <Link href={`/actors/${id}`}>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            {collaborationCount !== undefined && (
              <p className="text-sm text-gray-600">
                {collaborationCount} collaboration{collaborationCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}