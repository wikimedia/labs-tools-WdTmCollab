import axios from 'axios';

export function getSharedProductionsObj(actorId: any) {
  const data: any = [];
  return data;
}

const endpointUrl = 'https://query.wikidata.org/sparql';

export async function getSharedProductionsFunc(
  actor1Id: string,
  actor2Id: string,
) {
  //const a = Q2263;
  //const b = Q167498;
  const sparqlQuery = `SELECT DISTINCT 
  ?movie ?movieLabel 
  ?description
  ?image
  ?logo
  ?wikipediaArticle
  ?publicationDate
WHERE {
  # Replace Q123 and Q456 with your actor Wikidata IDs
  VALUES ?actor1 { wd:${actor1Id}}  # First actor
  VALUES ?actor2 { wd:${actor2Id}}  # Second actor
  
  # Find works that feature both actors
  ?movie wdt:P161 ?actor1, ?actor2.
  
  # Filter for movies (Q11424) or TV series (Q5398426)
  { ?movie wdt:P31 wd:Q11424 } UNION  # Movies
  { ?movie wdt:P31 wd:Q5398426 }      # TV shows
  
  # Get optional properties
  OPTIONAL { ?movie wdt:P18 ?image. }       # Main image
  OPTIONAL { ?movie wdt:P154 ?logo. }       # Logo image
  OPTIONAL { ?movie wdt:P577 ?publicationDate. }  # Publication date
  OPTIONAL { ?movie schema:description ?description. FILTER(LANG(?description) = 'en') }
  OPTIONAL {
    ?wikipediaArticle schema:about ?movie;
                     schema:isPartOf <https://en.wikipedia.org/>;
                     schema:name ?articleName.
  }
  
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language 'en'. 
  }
}
ORDER BY DESC(?publicationDate)
LIMIT 100`;
  try {
    const response = await axios.get(endpointUrl, {
      params: { query: sparqlQuery, format: 'json' },
    });
    //console.log(response);

    return response.data.results.bindings.map((movie: any) => ({
      title: movie.movieLabel?.value,
      description: movie.description?.value || 'No description available',
      image: movie.image?.value || null,
      logo: movie.logo?.value || null,
      wikipedia: movie.wikipediaArticle?.value || null,
      publicationDate: movie.publicationDate?.value || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching shared productions:', error);
    throw new Error('Failed to fetch shared productions');
  }
}

export async function getSharedActorsFunc(movie1Id: string, movie2Id: string) {
  console.log(movie1Id, movie2Id);

  const sparqlQuery = `SELECT DISTINCT ?actor ?actorLabel ?actorDescription ?image (COUNT(DISTINCT ?work) AS ?sharedWorks) WHERE {
    # Use movie IDs dynamically
    VALUES ?work { wd:${movie1Id} wd:${movie2Id} }  # The two movies/TV shows
    
    # Find actors in these works
    ?work wdt:P161 ?actor.
    
    # Get actor details
    OPTIONAL { ?actor wdt:P18 ?image. }
    SERVICE wikibase:label { 
      bd:serviceParam wikibase:language '[AUTO_LANGUAGE],en'. 
      ?actor rdfs:label ?actorLabel .
      ?actor schema:description ?actorDescription .
    }
  }
  GROUP BY ?actor ?actorLabel ?actorDescription ?image
  HAVING (COUNT(DISTINCT ?work) = 2)  # Must appear in both works
  ORDER BY ?actorLabel`;

  try {
    const response = await axios.get(endpointUrl, {
      params: { query: sparqlQuery, format: 'json' },
    });
    console.log(response);

    return response.data.results.bindings.map((actor: any) => ({
      id: actor.actor?.value.split('/').pop(), // Extracts the Wikidata ID
      name: actor.actorLabel?.value || 'Unknown',
      description: actor.actorDescription?.value || 'No description available',
      image: actor.image?.value || null,
      sharedWorks: actor.sharedWorks?.value || 0,
    }));
  } catch (error) {
    console.error('Error fetching shared actors:', error);
    throw new Error('Failed to fetch shared actors');
  }
}

export async function searchWikidataMedia(title: string) {
  const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(title)}&type=item&language=en&limit=10&format=json&origin=*`;

  try {
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    console.log(searchData);

    const detailedResults = await Promise.all(
      searchData.search.map(async (item: any) => {
        const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${item.id}&props=labels|descriptions|claims&format=json&origin=*`;
        const entityResponse = await fetch(entityUrl);
        const entityData = await entityResponse.json();
        const entity = entityData.entities[item.id];

        const isMovie = entity.claims?.P31?.some(
          (claim: any) => claim.mainsnak.datavalue?.value.id === 'Q11424',
        );
        const isTVShow = entity.claims?.P31?.some(
          (claim: any) => claim.mainsnak.datavalue?.value.id === 'Q5398426',
        );

        if (!isMovie && !isTVShow) return null;

        // Get image (try P18 first, then fall back to P154 for logo)
        const imageUrl =
          getImageUrl(entity.claims) || getLogoUrl(entity.claims);

        const result = {
          id: item.id,
          label: entity.labels?.en?.value || item.label,
          description: entity.descriptions?.en?.value || item.description || '',
          url: `https://www.wikidata.org/wiki/${item.id}`,
          type: isMovie ? 'movie' : 'tvshow',
          year: getYearFromClaims(entity.claims),
          imageUrl: imageUrl,
          imageType: imageUrl ? (entity.claims?.P18 ? 'poster' : 'logo') : null,
        };

        return result;
      }),
    );
    console.log(detailedResults);

    return detailedResults.filter((result) => result !== null);
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Helper function to extract year from claims
function getYearFromClaims(claims: any) {
  const dateClaim = claims?.P577?.[0]?.mainsnak?.datavalue?.value?.time;
  if (dateClaim) {
    return new Date(dateClaim).getFullYear();
  }
  return null;
}

// Helper function to get primary image URL (P18)
function getImageUrl(claims: any) {
  const imageClaim = claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (imageClaim) {
    const filename = encodeURIComponent(imageClaim.replace(/ /g, '_'));
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=300`;
  }
  return null;
}

// Helper function to get logo image URL (P154)
function getLogoUrl(claims: any) {
  const logoClaim = claims?.P154?.[0]?.mainsnak?.datavalue?.value;
  if (logoClaim) {
    const filename = encodeURIComponent(logoClaim.replace(/ /g, '_'));
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=300`;
  }
  return null;
}
