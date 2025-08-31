import Link from 'next/link';
import Navigation from './navigation';

export default function Header() {
  return (
    <header className='bg-white shadow-sm'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-8 w-8 text-blue-600'
            >
              <circle cx='12' cy='12' r='10' />
              <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
              <path d='M12 17h.01' />
            </svg>
            <span className='text-xl font-bold'>WDTMCollab </span>
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
}

