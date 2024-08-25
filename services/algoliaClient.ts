import { algoliasearch } from "algoliasearch";

// Replace with your Algolia app ID and API key
export const searchClient = algoliasearch(
  process.env.EXPO_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY || ""
);
