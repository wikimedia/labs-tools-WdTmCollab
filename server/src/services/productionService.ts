import axios from "axios";

export function getSharedProductionsObj(actorId: any) {
  const data: any = [];
  return data;
}

const endpointUrl = "https://query.wikidata.org/sparql";

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
  OPTIONAL { ?movie schema:description ?description. FILTER(LANG(?description) = "en") }
  OPTIONAL {
    ?wikipediaArticle schema:about ?movie;
                     schema:isPartOf <https://en.wikipedia.org/>;
                     schema:name ?articleName.
  }
  
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "en". 
  }
}
ORDER BY DESC(?publicationDate)
LIMIT 100`;
  try {
    const response = await axios.get(endpointUrl, {
      params: { query: sparqlQuery, format: "json" },
    });
    //console.log(response);

    return response.data.results.bindings.map((movie: any) => ({
      title: movie.movieLabel?.value,
      description: movie.description?.value || "No description available",
      image: movie.image?.value || null,
      logo: movie.logo?.value || null,
      wikipedia: movie.wikipediaArticle?.value || null,
      publicationDate: movie.publicationDate?.value || "Unknown",
    }));
  } catch (error) {
    console.error("Error fetching shared productions:", error);
    throw new Error("Failed to fetch shared productions");
  }
}
