import { gql } from '@apollo/client';

/**
 * GraphQL Mutations for modifying data
 * See: explanations/graphql/GraphQLQuickReference.md for details
 */

export const CREATE_QUIZ = gql`
  mutation CreateQuiz($input: CreateQuizInput!) {
    createQuiz(input: $input) {
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

export const UPDATE_QUIZ = gql`
  mutation UpdateQuiz($id: ID!, $input: UpdateQuizInput!) {
    updateQuiz(id: $id, input: $input) {
      id
      title
      description
      difficulty
      isPublished
      updatedAt
    }
  }
`;

export const DELETE_QUIZ = gql`
  mutation DeleteQuiz($id: ID!) {
    deleteQuiz(id: $id) {
      success
      message
    }
  }
`;

export const PUBLISH_QUIZ = gql`
  mutation PublishQuiz($id: ID!) {
    publishQuiz(id: $id) {
      id
      isPublished
    }
  }
`;

export const SUBMIT_QUIZ_ANSWERS = gql`
  mutation SubmitQuizAnswers($quizId: ID!, $answers: [AnswerInput!]!) {
    submitQuizAnswers(quizId: $quizId, answers: $answers) {
      id
      score
      isPassed
      submittedAt
      feedback
    }
  }
`;

export const SAVE_QUIZ_PROGRESS = gql`
  mutation SaveQuizProgress($quizId: ID!, $answers: [AnswerInput!]!) {
    saveQuizProgress(quizId: $quizId, answers: $answers) {
      savedAt
      progress
    }
  }
`;

export const ADD_QUESTION = gql`
  mutation AddQuestion($quizId: ID!, $input: QuestionInput!) {
    addQuestion(quizId: $quizId, input: $input) {
      id
      text
      type
      order
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($quizId: ID!, $questionId: ID!, $input: QuestionInput!) {
    updateQuestion(quizId: $quizId, questionId: $questionId, input: $input) {
      id
      text
      type
      options {
        id
        text
      }
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation DeleteQuestion($quizId: ID!, $questionId: ID!) {
    deleteQuestion(quizId: $quizId, questionId: $questionId) {
      success
    }
  }
`;
