import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <ul className="flex space-x-6">
        <li>
          <Link
            href="/actors"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Co-Actors/Collabs
          </Link>
        </li>
        <li>
          <Link
            href="/productions"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            shared productions
          </Link>
        </li>
        <li>
          <Link
            href="/compare"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Cross-project Actors
          </Link>
        </li>
      </ul>
    </nav>
  );
}
