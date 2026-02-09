/**
 * GraphQL barrel export - centralized imports
 * See: explanations/graphql/ for details
 */

export { apolloClient } from './apolloClient';

// Types
export type {
  GraphQLQuiz,
  GraphQLQuestion,
  GraphQLQuestionOption,
  GraphQLUser,
  GraphQLQuizAttempt,
  GraphQLStudentAnswer,
  GetQuizzesData,
  GetQuizData,
  GetQuizAttemptsData,
  GetMeData,
  CreateQuizData,
  SubmitQuizAnswersData,
  CreateQuizInput,
  CreateQuestionInput,
  CreateQuestionOptionInput,
  SubmitAnswerInput,
} from './types';

// Queries
export {
  GET_QUIZZES,
  GET_QUIZ,
  SEARCH_QUIZZES,
  GET_USER_QUIZZES,
  GET_QUIZ_ATTEMPTS,
  GET_BEST_ATTEMPT,
} from './queries';

// Mutations
export {
  CREATE_QUIZ,
  UPDATE_QUIZ,
  DELETE_QUIZ,
  PUBLISH_QUIZ,
  SUBMIT_QUIZ_ANSWERS,
  SAVE_QUIZ_PROGRESS,
  ADD_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION,
} from './mutations';
