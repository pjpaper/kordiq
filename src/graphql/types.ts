/**
 * GraphQL type definitions matching backend schema
 * See: explanations/types/TypeSystem.md for details
 */

// ============================================================================
// CORE GRAPHQL TYPES
// ============================================================================

export interface GraphQLQuiz {
  id: string;
  title: string;
  description: string | null;
  questions: GraphQLQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number | null; // Seconds
  passingScore: number;
  createdAt: string; // ISO datetime
  updatedAt: string;
  createdBy: GraphQLUser;
  isPublished: boolean;
}

export interface GraphQLQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: GraphQLQuestionOption[];
  correctOptionId: string;
  explanation: string | null;
  order: number;
}

export interface GraphQLQuestionOption {
  id: string;
  text: string;
  order: number;
}

export interface GraphQLUser {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  avatar: string | null;
  createdAt: string;
}

export interface GraphQLQuizAttempt {
  id: string;
  student: GraphQLUser;
  quiz: GraphQLQuiz;
  answers: GraphQLStudentAnswer[];
  score: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  timeSpent: number; // Seconds
}

export interface GraphQLStudentAnswer {
  id: string;
  question: GraphQLQuestion;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number;
}

// ============================================================================
// QUERY RESPONSE TYPES
// ============================================================================

export interface GetQuizzesData {
  quizzes: Pick<
    GraphQLQuiz,
    'id' | 'title' | 'description' | 'difficulty' | 'isPublished'
  > & {
    createdBy: Pick<GraphQLUser, 'id' | 'name'>;
  };
}

export interface GetQuizData {
  quiz: GraphQLQuiz;
}

export interface GetQuizAttemptsData {
  quizAttempts: Array<
    Pick<
      GraphQLQuizAttempt,
      'id' | 'score' | 'passed' | 'submittedAt' | 'timeSpent'
    > & {
      student: Pick<GraphQLUser, 'id' | 'name' | 'email'>;
    }
  >;
}

export interface GetMeData {
  me: GraphQLUser;
}

// ============================================================================
// MUTATION RESPONSE TYPES
// ============================================================================

export interface CreateQuizData {
  createQuiz: Pick<GraphQLQuiz, 'id' | 'title' | 'createdAt'>;
}

export interface SubmitQuizAnswersData {
  submitQuizAnswers: Pick<
    GraphQLQuizAttempt,
    'id' | 'score' | 'passed' | 'answers'
  >;
}

// ============================================================================
// INPUT TYPES (for mutations)
// ============================================================================

export interface CreateQuizInput {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: CreateQuestionInput[];
}

export interface CreateQuestionInput {
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: CreateQuestionOptionInput[];
  correctOptionId: string;
  explanation: string;
  order: number;
}

export interface CreateQuestionOptionInput {
  text: string;
  order: number;
}

export interface SubmitAnswerInput {
  questionId: string;
  selectedOptionId: string;
}
