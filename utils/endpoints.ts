// endpoints.ts or config.ts

/**
 * Base URL for API requests
 * Falls back to http://localhost:3001 if not defined in the environment variables
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://wdtmcollab-api.toolforge.org";

/**
 * A centralized list of API endpoints
 */
export const endpoints = {
  /**
   * Get productions shared between two actors
   * @param actor1Id - ID of the first actor
   * @param actor2Id - ID of the second actor
   * @returns A URL string for fetching shared productions
   */
  productionsShared: (actor1Id: string, actor2Id: string) =>
    `${API_BASE_URL}/productions/shared?actor1Id=${encodeURIComponent(actor1Id)}&actor2Id=${encodeURIComponent(actor2Id)}`,

  /**
   * Search for actors by name.
   * @param name - The name of the actor to search for
   * @returns A URL string for the actor search API
   */
  actorSearch: (name: string) => `${API_BASE_URL}/actors/search?name=${encodeURIComponent(name)}`,

  /**
   * Get a list of co-actors for a given actor.
   * @param actorId - The ID of the actor
   * @returns A URL string for fetching co-actors
   */
  co_ActorSearch: (actorId: string) =>
    `${API_BASE_URL}/actors/co-actors?actorId=${encodeURIComponent(actorId)}`,
  /**
   * Get shared actors between two movies.
   * @param movie1Id - ID of the first movie
   * @param movie2Id - ID of the second movie
   * @returns A URL string for fetching shared actors between two movies
   */
  sharedActors: (movie1Id: string, movie2Id: string) =>
    `${API_BASE_URL}/productions/shared-actors?movie1=${encodeURIComponent(movie1Id)}&movie2=${encodeURIComponent(movie2Id)}`,


  /**
   *Search for productions by title.
    * @param title - The title of the production to search for
   * 
  */
  movieSearch: (title: string) => `${API_BASE_URL}/productions/search?title=${encodeURIComponent(title)}`,
};
