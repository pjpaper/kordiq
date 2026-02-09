/**
 * Question in a quiz
 * See: explanations/types/TypeSystem.md for details
 */
export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'short-answer' | 'true-false' | 'essay';
  options?: string[]; // For multiple choice
  correctAnswer?: string | string[]; // For grading
  points?: number; // How many points for getting this right
  order: number; // Question order in quiz
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Quiz - main content entity created by teachers
 */
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdBy: string; // Teacher's user ID

  // Timing & Access Control
  timeLimit?: number; // minutes
  openDate?: Date;
  closeDate?: Date;
  isPublished: boolean; // Draft vs Published

  // Settings
  shuffleQuestions?: boolean;
  showCorrectAnswers?: boolean;
  passingScore?: number; // Percentage (0-100)

  // Metadata
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy?: string;
}

/**
 * Student's answer to a quiz question
 */
export interface StudentAnswer {
  questionId: string;
  answer: string | string[]; // Could be single answer or multiple answers
  savedAt: Date;
}

/**
 * Student's attempt at taking a quiz (tracks history)
 */
export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  answers: StudentAnswer[];
  score?: number; // Percentage (0-100)
  isPassed?: boolean;
  startedAt: Date;
  submittedAt: Date;
  timeSpent?: number; // seconds
}

/**
 * Final result after quiz submission with score
 */
export interface QuizResult {
  studentId: string;
  quizId: string;
  score: number;
  totalPoints: number;
  percentage: number; // score / totalPoints * 100
  isPassed: boolean;
  attempt: number; // 1st attempt, 2nd attempt, etc.
  completedAt: Date;
}

/**
 * QuizStats - Analytics data for a quiz
 * 
 * Teachers need to see:
 * - How many students took this quiz?
 * - What's the average score?
 * - Which question did students struggle with?
 */
export interface QuizStats {
  quizId: string;
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number; // percentage of students who passed
  questionStats: {
    questionId: string;
    correctCount: number;
    incorrectCount: number;
    averageTime?: number; // seconds
  }[];
}
