import { gql } from '@apollo/client';

/**
 * GraphQL Queries for fetching data
 * See: explanations/graphql/GraphQLQuickReference.md for details
 */

export const GET_QUIZZES = gql`
  query GetQuizzes {
    quizzes {
      id
      title
      description
      difficulty
      isPublished
      createdAt
      createdBy {
        id
        name
      }
    }
  }
`;

export const GET_QUIZ = gql`
  query GetQuiz($id: ID!) {
    quiz(id: $id) {
      id
      title
      description
      difficulty
      timeLimit
      passingScore
      isPublished
      createdBy {
        id
        name
      }
      questions {
        id
        text
        type
        order
        options {
          id
          text
          order
        }
      }
    }
  }
`;

export const SEARCH_QUIZZES = gql`
  query SearchQuizzes($searchTerm: String!, $difficulty: String, $tags: [String]) {
    searchQuizzes(searchTerm: $searchTerm, difficulty: $difficulty, tags: $tags) {
      id
      title
      description
      difficulty
      createdBy {
        id
        name
      }
    }
  }
`;

export const GET_USER_QUIZZES = gql`
  query GetUserQuizzes {
    userQuizzes {
      id
      title
      isPublished
      createdAt
      questions {
        id
      }
    }
  }
`;

export const GET_QUIZ_ATTEMPTS = gql`
  query GetQuizAttempts($quizId: ID!) {
    quizAttempts(quizId: $quizId) {
      id
      studentId
      score
      isPassed
      submittedAt
      timeSpent
    }
  }
`;

export const GET_BEST_ATTEMPT = gql`
  query GetBestAttempt($quizId: ID!) {
    bestAttempt(quizId: $quizId) {
      id
      score
      isPassed
      submittedAt
    }
  }
`;
