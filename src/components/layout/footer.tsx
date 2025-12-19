import Image from "next/image";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

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
                alt={t('wikidataLogoAlt')}
                className='h-8 w-auto'
              />
            </Link>
          </div>

          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>
              {t('copyright', { year: new Date().getFullYear() })}
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
                alt={t('mediaWikiLogoAlt')}
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
