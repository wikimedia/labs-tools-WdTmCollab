// import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex md:flex-row justify-between items-center">
          <div className="flex items-center mt-4">
            <a
              href="https://www.wikidata.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mr-4"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/f4/Wikidata_logo_Spanish_vertical_in_colour.svg"
                alt="Wikidata logo"
                className="h-10 w-10"
              />
            </a>
          </div>
          <div className="justify-center items-center">
            <p className="text-sm text-gray-800 justify-cente">
              &copy; {new Date().getFullYear()} WDTMCollab. License for content:
              CC0 for data, CC-BY-SA for text and media.
            </p>
          </div>
          <div className="justify-end">
            <a
              href="https://www.mediawiki.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Wikimedia_logo_Spanish_vertical_in_colour.svg"
                alt="MediaWiki logo"
                className="h-10 w-10"
              />
            </a>
          </div>
          {/* <div className="flex space-x-4">
            <Link
              href="/about"
              className="text-sm text-black"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-black"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-black"
            >
              Contact
            </Link>
            <a href="#" className="text-sm text-black">
              GitLab
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
