/**
 * Base URL for API requests
 * Falls back to http://localhost:3001 if not defined in the environment variables
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://wdtmcollab-api.toolforge.org";

/**
 * API Version - targeting v2 endpoints with rate limiting and better features
 */
const API_VERSION = "v2";

/**
 * A centralized list of API endpoints using v2 versioned paths
 */
export const endpoints = {
  /**
   * Get productions shared between two actors.
   * @param actor1Id - The Wikidata ID of the first actor
   * @param actor2Id - The Wikidata ID of the second actor
   * @returns A URL string for fetching shared productions
   */
  productionsShared: (actor1Id: string, actor2Id: string) =>
    `${API_BASE_URL}/api/${API_VERSION}/productions/shared?actor1Id=${encodeURIComponent(actor1Id)}&actor2Id=${encodeURIComponent(actor2Id)}`,

  /**
   * Search for actors by name.
   * @param name - The name of the actor to search for
   * @returns A URL string for the actor search API
   */
  actorSearch: (name: string) =>
    `${API_BASE_URL}/api/${API_VERSION}/actors/search?name=${encodeURIComponent(name)}`,

  /**
   * Get a list of co-actors for a given actor.
   * @param actorId - The Wikidata ID of the actor
   * @returns A URL string for fetching co-actors
   */
  co_ActorSearch: (actorId: string) =>
    `${API_BASE_URL}/api/${API_VERSION}/actors/co-actors?actorId=${encodeURIComponent(actorId)}`,

  /**
   * Get shared actors between two movies.
   * @param movie1Id - The Wikidata ID of the first movie
   * @param movie2Id - The Wikidata ID of the second movie
   * @returns A URL string for fetching shared actors between two movies
   */
  sharedActors: (movie1Id: string, movie2Id: string) =>
    `${API_BASE_URL}/api/${API_VERSION}/productions/shared-actors?movie1=${encodeURIComponent(movie1Id)}&movie2=${encodeURIComponent(movie2Id)}`,

  /**
   * Get actor details (label, description, image) proxied through the backend.
   * @param id - The Wikidata ID of the actor (e.g., Q123)
   * @returns A URL string for fetching actor details
   */
  actorDetails: (id: string) =>
    `${API_BASE_URL}/api/${API_VERSION}/actors/details/${encodeURIComponent(id)}`,

  /**
   * Search for productions (movies/TV) by title.
   * @param title - The title of the production to search for
   * @returns A URL string for the media search API
   */
  movieSearch: (title: string) =>
    `${API_BASE_URL}/api/${API_VERSION}/productions/search?title=${encodeURIComponent(title)}`,

  /**
   * Get a list of popular actors from the backend.
   * @returns A URL string for fetching popular actors
   */
  actorPopular: () => `${API_BASE_URL}/api/${API_VERSION}/actors/popular`,

  // --- NEW COLLABORATION ENDPOINTS ---
  collabNetwork: (id: string) => `${API_BASE_URL}/api/${API_VERSION}/collaborators/${id}/network`,
  collabStats: (id: string) => `${API_BASE_URL}/api/${API_VERSION}/collaborators/${id}/stats`,
  collabTrends: (id: string) => `${API_BASE_URL}/api/${API_VERSION}/collaborators/${id}/trends`,
  collabClusters: (id: string) => `${API_BASE_URL}/api/${API_VERSION}/collaborators/${id}/clusters`,

  commonCollaborators: (id1: string, id2: string) =>
    `${API_BASE_URL}/api/${API_VERSION}/collaborators/common?actor1Id=${id1}&actor2Id=${id2}`,

};