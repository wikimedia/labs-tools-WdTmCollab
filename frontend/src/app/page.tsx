import Link from 'next/link';
import Header from '@/src/components/layout/header';

export default function Home() {
  return (
    <main>
      <Header />

      <div className='container mx-auto px-4 py-12'>
        <section className='mb-16 text-center'>
          <h1 className='text-4xl font-bold mb-4'>
            Wikidata TransMedia Collaboration
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Explore the interconnected world of actors, discover frequent
            collaborators, and visualize the networks of the entertainment
            industry.
          </p>
        </section>

        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          <FeatureCard
            title='Frequent Collaborators'
            description='Discover which actors work together most often'
            icon={<CollaboratorsIcon />}
            link='/actors'
          />
          <FeatureCard
            title='Shared Productions'
            description='Find all movies and TV shows shared between actors'
            icon={<ProductionsIcon />}
            link='/compare'
          />
          <FeatureCard
            title='Cross-Project Actors'
            description='Identify actors who appeared in multiple productions'
            icon={<CrossProjectIcon />}
            link='/productions'
          />
          <FeatureCard
            title='Collaboration Clusters'
            description='Visualize groups of actors who frequently work together'
            icon={<ClusterIcon />}
            link='/clusters'
          />
        </section>

        <section className='bg-white rounded-xl shadow-md p-8 mb-16'>
          <h2 className='text-2xl font-bold mb-4'>Popular Actors</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {popularActors.map((actor) => (
              <Link
                key={actor.id}
                href={`/actors/${actor.id}`}
                className='block p-4 border rounded-lg hover:bg-gray-50 transition-colors'
              >
                <div className='font-medium'>{actor.name}</div>
                <div className='text-sm text-gray-500'>
                  {actor.collaborations} collaborations
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  link,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <Link
      href={link}
      className='block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow'
    >
      <div className='text-blue-600 mb-4'>{icon}</div>
      <h3 className='font-bold mb-2'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </Link>
  );
}

// Icons
function CollaboratorsIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
    </svg>
  );
}

function ProductionsIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect width='18' height='18' x='3' y='3' rx='2' />
      <path d='m9 9 6 6' />
      <path d='m15 9-6 6' />
    </svg>
  );
}

function CrossProjectIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M8 3H5a2 2 0 0 0-2 2v3' />
      <path d='M21 8V5a2 2 0 0 0-2-2h-3' />
      <path d='M3 16v3a2 2 0 0 0 2 2h3' />
      <path d='M16 21h3a2 2 0 0 0 2-2v-3' />
    </svg>
  );
}

function ClusterIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10' />
      <circle cx='12' cy='12' r='4' />
      <line x1='21.17' x2='12' y1='8' y2='8' />
      <line x1='3.95' x2='8.54' y1='6.06' y2='14' />
      <line x1='10.88' x2='15.46' y1='21.94' y2='14' />
    </svg>
  );
}

// Placeholder data
const popularActors = [
  { id: '38111', name: 'Tom Hanks', collaborations: 87 },
  { id: '17492', name: 'Meryl Streep', collaborations: 92 },
  { id: '42215', name: 'Leonardo DiCaprio', collaborations: 76 },
  { id: '39187', name: 'Viola Davis', collaborations: 68 },
  { id: '28782', name: 'Denzel Washington', collaborations: 81 },
  { id: '37917', name: 'Cate Blanchett', collaborations: 73 },
  { id: '51329', name: 'Samuel L. Jackson', collaborations: 104 },
  { id: '47981', name: 'Emma Thompson', collaborations: 65 },
];

