import Link from "next/link";

export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex space-x-6" role="list">
        <li>
          <Link
            href="/actors"
            className="text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1"
            aria-label="View co-actors and collaborators"
          >
            Find Collaborators
          </Link>
        </li>
        <li>
          <Link
            href="/productions"
            className="text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1"
            aria-label="View shared productions"
          >
            Shared Productions
          </Link>
        </li>
        <li>
          <Link
            href="/compare"
            className="text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1"
            aria-label="Compare cross-project actors"
          >
            Compare Actors
          </Link>
        </li>
      </ul>
    </nav>
  );
}
