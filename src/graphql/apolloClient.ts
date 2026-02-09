import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client';

/**
 * Apollo Client configuration for GraphQL queries
 * See: explanations/graphql/ApolloArchitecture.md for detailed explanation
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: API_BASE_URL,
  credentials: 'include',
});

/**
 * Auth middleware: Add Bearer token to every GraphQL request
 */
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('kordiq_auth_token');

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

const link = concat(authLink, httpLink);

/**
 * In-memory cache for Apollo queries and mutations
 * Automatically deduplicates requests and caches results
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {},
    },
  },
});

/**
 * Main Apollo Client instance
 */
export const apolloClient = new ApolloClient({
  link,
  cache,
});
