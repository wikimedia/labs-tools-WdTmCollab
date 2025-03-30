🎭 Actor Collaboration Analyzer – A Data-Driven Tool for Exploring Actor Networks in Film & TV
📌 Project Overview
The entertainment industry thrives on collaborations between actors, directors, and producers. Many actors frequently appear together across multiple films and TV shows, forming professional networks. The Actor Collaboration Analyzer leverages Wikidata’s structured film and television data to explore these connections.

By analyzing shared projects, the tool provides insights into actor partnerships, crossovers, and recurring groups in the industry.

🎯 Objectives
✅ Identify actors who frequently collaborate based on shared movie and TV appearances.
✅ List all shared productions between two given actors.
✅ Determine which actors have appeared in both of the two selected movies or TV shows.
✅ Detect clusters of actors who frequently star together.
✅ Extend analysis to directors, producers, and showrunners for industry-wide insights.

🚀 Features
🔹 Frequent Collaborators – Find actors who have frequently appeared together.
🔹 Shared Casting – Retrieve all TV shows and movies two actors have in common.
🔹 Cross-Project Actors – Identify actors who starred in both of two given productions.
🔹 Collaboration Clusters – Detect large groups of actors with frequent shared appearances.
🔹 Industry Network Analysis – Expand insights to directors, producers, and writers.

📌 Use Cases
👥 For Film Enthusiasts – Discover unexpected actor connections.
🎬 For Industry Professionals – Analyze collaboration trends for casting and networking.
📝 For Trivia & Research – Explore historical film relationships and industry patterns.
💻 For Developers – Provide an API for integrating this data into other applications.

🔍 Technical Approach
The project utilizes Wikidata’s SPARQL endpoint to query structured data on movies, TV shows, and actors. A graph database stores and analyzes relationships for faster processing and visualization.

🛠 Technical Breakdown
📌 Data Source: Wikidata (SPARQL queries for filmography and actor collaborations).
📌 Graph Structure:

Nodes: Actors, movies, TV shows, directors, producers.

Edges: Shared projects (film/TV).
📌 Querying Methods:

Identify shared projects between actors.

Find actors in common between two movies or TV shows.

Use cluster detection algorithms to find recurring groups.
📌 Frontend/UI: Interactive web application for visualizing collaboration networks.

🎯 Expected Outcomes
✅ A working prototype capable of retrieving actor collaborations from Wikidata.
✅ An efficient querying system for analyzing industry-wide relationships.
✅ A potential web interface or API for ease of access.

🛠 Tools & Technologies
🔹 Data Source: Wikidata (SPARQL API)
🔹 Backend: Node.js for data processing
🔹 Database: Neo4j (Graph Database)
🔹 Frontend: React / D3.js (for visualization, if implemented)




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Wikidata Queries

The following Wikidata queries are used to fetch relevant data for this project. Developers and contributors can refer to them for better understanding and debugging.

1. Finding Actors Who Have Worked Together
The following SPARQL query retrieves actors who have shared roles in multiple works with a specified actor.

🔹 How It Works:
-  Replace Q40096 with the Wikidata ID of the target actor.

-  The query searches for works they performed in and finds other    actors who were in the same productions.

-  It excludes the original actor and only lists those who appeared in more than one shared work.

-  Optional fields: Retrieves actor names, descriptions, and images for better clarity.

#... Query ...#

SELECT DISTINCT 
  ?actorY 
  ?actorYLabel 
  ?actorYDescription
  ?image
  (COUNT(DISTINCT ?work) AS ?sharedWorks) 
WHERE {
  # Replace Q40096 with the Wikidata ID of your actor X
  VALUES ?actorX { wd:Q40096 }
  
  # Find works that actor X has performed in
  ?work wdt:P161 ?actorX.
  
  # Find other actors who performed in the same works
  ?work wdt:P161 ?actorY.
  
  # Exclude actor X themselves
  FILTER(?actorY != ?actorX)
  
  # Get optional image
  OPTIONAL { ?actorY wdt:P18 ?image. }
  
  # Get labels and descriptions
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
    ?actorY rdfs:label ?actorYLabel .
    ?actorY schema:description ?actorYDescription .
  }
}
GROUP BY ?actorY ?actorYLabel ?actorYDescription ?image
# Only show actors who shared more than one work
HAVING (COUNT(DISTINCT ?work) > 1)
ORDER BY DESC(?sharedWorks)

######

You can check the results of this query by visiting this site: https://w.wiki/DdeE 

2. Fetching Movies Featuring Two Actors
This JavaScript class enables querying the Wikidata SPARQL endpoint to retrieve movies or TV shows featuring two specified actors.

📌 How It Works:
-  Replace Q2263 and Q167498 with the Wikidata IDs of the actors you want to compare.

-  The query searches for movies (Q11424) or TV shows (Q5398426) where both actors appeared.

-  It retrieves movie details, including:

   - Title & Description

   - Images (Poster & Logo)

   - Publication Date

   - Wikipedia Article (if available)


# SPARQL Query

SELECT DISTINCT 
  ?movie ?movieLabel 
  ?description
  ?image
  ?logo
  ?wikipediaArticle
  ?publicationDate
WHERE {
  # Replace Q2263 and Q167498 with your actor Wikidata IDs
  VALUES ?actor1 { wd:Q2263 }  # First actor
  VALUES ?actor2 { wd:Q167498 }  # Second actor
  
  # Find works that feature both actors
  ?movie wdt:P161 ?actor1, ?actor2.
  
  # Filter for movies (Q11424) or TV series (Q5398426)
  { ?movie wdt:P31 wd:Q11424 } UNION  # Movies
  { ?movie wdt:P31 wd:Q5398426 }      # TV shows
  
  # Get optional properties
  OPTIONAL { ?movie wdt:P18 ?image. }       # Main image
  OPTIONAL { ?movie wdt:P154 ?logo. }       # Logo image
  OPTIONAL { ?movie wdt:P577 ?publicationDate. }  # Publication date
  OPTIONAL { 
    ?movie schema:description ?description. 
    FILTER(LANG(?description) = "en") 
  }
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
LIMIT 100

######

You can check the results of this query by visiting this site: https://w.wiki/DdeL

3. Fetching Actors Who Appeared in Two Movies/TV Shows
   
   Overview
     This SPARQL query retrieves actors who have performed in two specific movies or TV shows from Wikidata. It helps identify common cast members between two works.

    SPARQL Query Explanation

-   Replace Q83495 and Q15732802 with the Wikidata IDs of the movies or TV shows.

-   It finds actors who performed in both works.

-   Retrieves details such as:

    -   Name & Description

    -   Profile Image (if available)

    - Number of Shared Works

# SPARQL Query

SELECT DISTINCT ?actor ?actorLabel ?actorDescription ?image (COUNT(DISTINCT ?work) AS ?sharedWorks) WHERE {
  # Replace QXXXX and QYYYY with your movie/TV show Wikidata IDs
  VALUES ?work { wd:Q83495 wd:Q15732802 }  # The two movies/TV shows
  
  # Find actors in these works
  ?work wdt:P161 ?actor.
  
  # Get actor details
  OPTIONAL { ?actor wdt:P18 ?image. }
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
    ?actor rdfs:label ?actorLabel .
    ?actor schema:description ?actorDescription .
  }
}
GROUP BY ?actor ?actorLabel ?actorDescription ?image
HAVING (COUNT(DISTINCT ?work) = 2)  # Must appear in both works
ORDER BY ?actorLabel

######

You can check the results of this query by visiting this site: https://w.wiki/DdeP
