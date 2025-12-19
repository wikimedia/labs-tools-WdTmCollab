import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className='border-t bg-muted/40'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='flex items-center'>
            <Link
              href='https://www.wikidata.org/'
              target='_blank'
              rel='noopener noreferrer'
              className='opacity-80 hover:opacity-100 transition-opacity'
            >
              <img
                src='https://upload.wikimedia.org/wikipedia/commons/f/f4/Wikidata_logo_Spanish_vertical_in_colour.svg'
                alt='Wikidata logo'
                className='h-8 w-auto'
              />
            </Link>
          </div>

          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>
              &copy; {new Date().getFullYear()} WdTmCollab.
              <span className='block sm:inline sm:ml-1'>
                CC0 for data, CC-BY-SA for text.
              </span>
            </p>
          </div>

          <div className='flex items-center'>
            <Link
              href='https://www.mediawiki.org/'
              target='_blank'
              rel='noopener noreferrer'
              className='opacity-80 hover:opacity-100 transition-opacity'
            >
              <Image
                src='https://upload.wikimedia.org/wikipedia/commons/c/ca/Wikimedia_logo_Spanish_vertical_in_colour.svg'
                alt='MediaWiki logo'
                width={40}
                height={40}
                className='h-8 w-auto'
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
