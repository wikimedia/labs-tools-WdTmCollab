import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <ul className="flex space-x-6">
        <li>
          <Link href="/actors" className="text-gray-600 hover:text-blue-600 transition-colors">
            Actors
          </Link>
        </li>
        <li>
          <Link href="/productions" className="text-gray-600 hover:text-blue-600 transition-colors">
            Productions
          </Link>
        </li>
        <li>
          <Link href="/compare" className="text-gray-600 hover:text-blue-600 transition-colors">
            Compare
          </Link>
        </li>
        <li>
          <Link href="/clusters" className="text-gray-600 hover:text-blue-600 transition-colors">
            Clusters
          </Link>
        </li>
      </ul>
    </nav>
  );
}