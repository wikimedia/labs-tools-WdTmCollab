# WdTmCollab

**Wikidata Transmedia Collaboration Explorer**

_WdTmCollab_ is a tool which leverages Wikidata's structured film and television data to analyze their partnerships, identifying frequent collaborators and shared projects while extending insights to directors and producers for a comprehensive view of industry dynamics.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
  - [Base URL](#base-url)
  - [Headers](#headers)
  - [Response Format](#response-format)
  - [Endpoints](#endpoints)
    - [Actors](#actors)
    - [Productions](#productions)
  - [Errors & Rate Limiting](#errors--rate-limiting)
- [Accessibility](#accessibility)

---

## About the Project

This tool visualizes connections in the film industry using data from Wikidata. It helps users explore:
- **Actor Collaborations**: Who works with whom frequently?
- **Shared Productions**: Which movies/shows feature specific pairings?
- **Industry Dynamics**: Insights into directors and producers.

**Deployed Application:** [https://wdtmcollab.toolforge.org](https://wdtmcollab.toolforge.org)

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Visualization**: [D3.js](https://d3js.org/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Testing**: [Playwright](https://playwright.dev/)

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v20 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://gerrit.wikimedia.org/r/admin/repos/labs/tools/WdTmCollab
   cd WdTmCollab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

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

## API Documentation

The WdTmCollab API provides endpoints for accessing Wikidata film and television data.

### Base URL

```
https://wdtmcollab-api.toolforge.org
```

### Headers

All API requests should include the following headers:

```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

### Response Format

Success responses return JSON data. Errors return a standard error object.

**Error Example:**
```json
{
  "error": "Error description",
  "message": "Detailed error message",
  "status": 400
}
```

### Endpoints

#### Actors

##### `GET /actors/search`
Search for actors by name.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name`    | string | Yes    | The name of the actor to search for. |

**Example:**
```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/actors/search?name=Tom%20Hanks"
```

##### `GET /actors/details/{id}`
Get detailed information about a specific actor.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id`      | string | Yes    | The Wikidata ID of the actor (e.g., `Q2263`). |

**Example:**
```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/actors/details/Q2263"
```

##### `GET /actors/co-actors`
Get co-actors for a given actor.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `actor1Id` | string | Yes    | -       | The Wikidata ID of the actor. |
| `limit`   | integer | No    | 20      | Number of results to return. |
| `offset`  | integer | No    | 0       | Number of results to skip. |

**Example:**
```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/actors/co-actors?actorId=Q2263&limit=8"
```

##### `GET /actors/popular`
Get a list of popular actors.

**Example:**
```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/actors/popular"
```

#### Productions

##### `GET /productions/search`
Search for productions (movies/TV) by title.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title`   | string | Yes    | The title of the production to search for. |

**Example:**
```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/productions/search?title=Forrest%20Gump"
```

##### `GET /productions/shared`
Get productions shared between two actors.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `actor1Id`| string | Yes    | The Wikidata ID of the first actor. |
| `actor2Id`| string | Yes    | The Wikidata ID of the second actor. |

**Example:**
```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/productions/shared?actor1Id=Q2263&actor2Id=Q27205"
```

##### `GET /productions/shared-actors`
Get shared actors between two movies.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `movie1`  | string | Yes    | The Wikidata ID of the first movie. |
| `movie2`  | string | Yes    | The Wikidata ID of the second movie. |

**Example:**
```bash
curl -X GET "https://wdtmcollab-api.toolforge.org/productions/shared-actors?movie1=Q43274&movie2=Q223423"
```

### Errors & Rate Limiting

- **Status Codes**:
  - `200 OK`: Request successful.
  - `400 Bad Request`: Missing parameters or invalid format.
  - `404 Not Found`: Resource not found.
  - `429 Too Many Requests`: Rate limit exceeded.
  - `500 Internal Server Error`: Server error.

- **Rate Limiting**: Fair usage policies apply. If exceeded, a `429` status is returned.

## Accessibility

WdTmCollab is committed to digital accessibility.

### Features
- **Skip to Content**: Bypass navigation for keyboard users.
- **Keyboard Navigation**: Full support for interactive elements.
- **Semantic HTML**: Optimized for screen readers.

### Testing
Automated accessibility tests use `axe-playwright`.

```bash
npx playwright test src/tests/accessibility.spec.ts
```
