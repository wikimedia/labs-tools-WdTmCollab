import SparqlClient from 'sparql-http-client';

export function getFrequentCollaborators(actorId: any) {
  const data: any = [];
  return data;
}

const WIKIDATA_SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

/**
 * Finds co-actors who have worked with a given actor in multiple projects.
 * @param {string} actorId - The Wikidata ID of the actor (e.g., 'Q40096' for Tom Hanks).
 * @returns {Promise<Array>} - List of co-actors with details.
 */
export async function findCoActors(actorId: any): Promise<any> {
  console.log(actorId);

  const query = `
        SELECT DISTINCT 
            ?actorY 
            ?actorYLabel 
            ?actorYDescription
            ?image
            (COUNT(DISTINCT ?work) AS ?sharedWorks) 
        WHERE {
            VALUES ?actorX { wd:${actorId} }
            
            ?work wdt:P161 ?actorX.
            ?work wdt:P161 ?actorY.
            
            FILTER(?actorY != ?actorX)
            
            OPTIONAL { ?actorY wdt:P18 ?image. }
            
            SERVICE wikibase:label { 
                bd:serviceParam wikibase:language '[AUTO_LANGUAGE],en'. 
                ?actorY rdfs:label ?actorYLabel .
                ?actorY schema:description ?actorYDescription .
            }
        }
        GROUP BY ?actorY ?actorYLabel ?actorYDescription ?image
        HAVING (COUNT(DISTINCT ?work) > 1)
        ORDER BY DESC(?sharedWorks)
    `;

  try {
    const client = new SparqlClient({ endpointUrl: WIKIDATA_SPARQL_ENDPOINT });
    // Using async iteration instead of event listeners
    const stream = await client.query.select(query);
    const results = [];

    for await (const row of stream) {
      results.push({
        actorId: row.actorY.value,
        name: row.actorYLabel?.value || 'Unknown',
        description: row.actorYDescription?.value || 'No description',
        image: row.image?.value || null,
        sharedWorks: row.sharedWorks.value,
      });
    }
    //console.log(results);

    return results;
  } catch (error) {
    console.error('Error fetching SPARQL data:', error);
    return [];
  }
}

// Example usage
//findCoActors('Q40096').then(console.log);

interface WikidataSearchResult {
  id: string;
  label: string;
  description: string;
  url: string;
  imageUrl: string | null;
}

export async function searchWikidataActor(actorName: any) {
  // First search for entities matching the actor name
  const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(actorName)}&type=item&language=en&limit=10&format=json&origin=*`;

  try {
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    // For each result, fetch detailed entity data to get the image
    const detailedResults = await Promise.all(
      searchData.search.map(async (item: any) => {
        const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${item.id}&props=claims&format=json&origin=*`;
        const entityResponse = await fetch(entityUrl);
        const entityData = await entityResponse.json();

        // Get image URL (P18 property)
        const claims = entityData.entities[item.id]?.claims;
        const imageClaim = claims?.P18?.[0]?.mainsnak?.datavalue?.value;
        let imageUrl = null;

        if (imageClaim) {
          // Convert the image filename to a Commons URL
          const filename = encodeURIComponent(imageClaim.replace(/ /g, '_'));
          imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=300`;
        }

        return {
          id: item.id,
          label: item.label,
          description: item.description || '',
          url: `https://www.wikidata.org/wiki/${item.id}`,
          imageUrl: imageUrl,
        };
      }),
    );

    return detailedResults;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
//
//// Example usage
//searchWikidataActor('Will smith').then((results) => {
//  console.log(results);
//  // Example of how to display the first result's image:
//  if (results.length > 0 && results[0].imageUrl) {
//    document.body.innerHTML += `<img src='${results[0].imageUrl}' alt='${results[0].label}'>`;
//  }
//});
