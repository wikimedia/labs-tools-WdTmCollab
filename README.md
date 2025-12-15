# WdTmCollab

_**WdTmCollab**_ (Wikidata Transmedia Collaboration Explorer) is a tool which leverages Wikidata's structured film and television data to analyze their partnerships, identifying frequent collaborators and shared projects while extending insights to directors and producers for a comprehensive view of industry dynamics.

## Developer Set up

- Clone the code from the [repository](https://gerrit.wikimedia.org/r/admin/repos/labs/tools/WdTmCollab) on gerrit.

- Run the `npm install` command

- Run the frontend locally :

  ```bash
  npm run dev
  # or
  yarn dev
  # or
  pnpm dev
  # or
  bun dev
  ```

To access the locally running development version, open <http://localhost:3000> in your browser after starting the frontend server.

To access the publicly deployed tool, visit <https://wdtmcollab.toolforge.org>.

## API Endpoints

The WdTmCollab API provides endpoints for accessing Wikidata film and television data. All API requests are made to the base URL:

```https
https://wdtmcollab-api.toolforge.org
```

### Headers

All API requests should include the following headers:

```json
Content-Type: application/json
Accept: application/json
```

### Response Format

All successful responses return JSON data with the appropriate HTTP status codes. Error responses include a `message` field with details about the error.

#### Error Response Format

```json
{
  "error": "Error description",
  "message": "Detailed error message",
  "status": 400
}
```

---

### GET /actors/search

Search for actors by name

**Query Parameters:**

- `name` (required, string) - The name of the actor to search for

**Example Request:**

```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/actors/search?name=Tom%20Hanks"
```

**Example Response:**

```json
[
  {
    "id": "Q2263",
    "label": "Tom Hanks",
    "description": "American actor and producer",
    "url": "https://www.wikidata.org/wiki/Q2263",
    "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Tom%20Hanks%202018.jpg"
  }
]
```

---

### GET /actors/details/{id}

Get detailed information about a specific actor

**Path Parameters:**

- `id` (required, string) - The Wikidata ID of the actor (e.g., Q2263)

**Example Request:**

```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/actors/details/Q2263"
```

**Example Response:**

```json
{
  "id": "Q2263",
  "name": "Tom Hanks",
  "bio": "Thomas Jeffrey Hanks is an American actor and producer...",
  "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Tom%20Hanks%202018.jpg",
  "dateOfBirth": "1956-07-09",
  "placeOfBirth": "Concord, California, U.S.",
  "countryOfCitizenship": "United States of America",
  "gender": "male",
  "occupations": ["actor", "film producer", "screenwriter", "voice actor"],
  "productions": [...],
  "awards": [...],
  "website": "https://tomhanks.com/",
  "coActors": [...]
}
```

---

### GET /actors/co-actors

Get co-actors for a given actor

**Query Parameters:**

- `actorId` (required, string) - The Wikidata ID of the actor
- `limit` (optional, integer) - Number of results to return (default: 20)
- `offset` (optional, integer) - Number of results to skip (default: 0)

**Example Request:**

```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/actors/co-actors?actorId=Q2263&limit=8&offset=0"
```

**Example Response:**

```json
[
  {
    "id": "Q27205",
    "label": "Meg Ryan",
    "description": "American actress",
    "url": "https://www.wikidata.org/wiki/Q27205",
    "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Meg%20Ryan%202012.jpg"
  }
]
```

---

### GET /actors/popular

Get a list of popular actors

**Example Request:**

```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/actors/popular"
```

**Example Response:**

```json
[
  {
    "id": "Q2263",
    "label": "Tom Hanks",
    "description": "American actor and producer",
    "url": "https://www.wikidata.org/wiki/Q2263",
    "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Tom%20Hanks%202018.jpg"
  },
  {
    "id": "Q27205",
    "label": "Meg Ryan",
    "description": "American actress",
    "url": "https://www.wikidata.org/wiki/Q27205",
    "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Meg%20Ryan%202012.jpg"
  }
]
```

---

### GET /productions/search

Search for productions (movies/TV) by title

**Query Parameters:**

- `title` (required, string) - The title of the production to search for

**Example Request:**

```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/productions/search?title=Forrest%20Gump"
```

**Example Response:**

```json
[
  {
    "id": "Q43274",
    "label": "Forrest Gump",
    "description": "1994 film by Robert Zemeckis",
    "type": "film",
    "url": "https://www.wikidata.org/wiki/Q43274",
    "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Forrest%20Gump%20poster.jpg",
    "year": 1994
  }
]
```

---

### GET /productions/shared

Get productions shared between two actors

**Query Parameters:**

- `actor1Id` (required, string) - The Wikidata ID of the first actor
- `actor2Id` (required, string) - The Wikidata ID of the second actor

**Example Request:**

```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/productions/shared?actor1Id=Q2263&actor2Id=Q27205"
```

**Example Response:**

```json
[
  {
    "id": "Q43274",
    "title": "Forrest Gump",
    "description": "1994 film by Robert Zemeckis",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Forrest%20Gump%20poster.jpg",
    "logo": null,
    "wikipedia": "https://en.wikipedia.org/wiki/Forrest_Gump",
    "publicationDate": "1994-07-23"
  }
]
```

---

### GET /productions/shared-actors

Get shared actors between two movies

**Query Parameters:**

- `movie1` (required, string) - The Wikidata ID of the first movie
- `movie2` (required, string) - The Wikidata ID of the second movie

**Example Request:**

```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/productions/shared-actors?movie1=Q43274&movie2=Q223423"
```

**Example Response:**

```json
[
  {
    "id": "Q2263",
    "name": "Tom Hanks",
    "description": "American actor and producer",
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Tom%20Hanks%202018.jpg",
    "sharedWorks": "Forrest Gump, Cast Away",
    "awardCount": "2"
  }
]
```

---

### HTTP Status Codes

- **200 OK** - Request successful
- **400 Bad Request** - Missing required parameters or invalid request format
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

### Rate Limiting

The API may implement rate limiting to ensure fair usage. If you exceed the rate limit, you will receive a `429 Too Many Requests` response.

---

## Accessibility
