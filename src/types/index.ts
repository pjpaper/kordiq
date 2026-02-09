/**
 * CENTRALIZED TYPE EXPORTS
 * 
 * Instead of importing types from scattered files:
 *   import { User } from '@/types/user';
 *   import { Quiz } from '@/types/quiz';
 *   import { AsyncState } from '@/types/common';
 * 
 * Do this (cleaner):
 *   import { User, Quiz, AsyncState } from '@/types';
 * 
 * This is a BARREL EXPORT for types (same pattern as components).
 */

export type { User, Teacher, Student, AuthToken, AuthState } from './user';
export type { Question, Quiz, StudentAnswer, QuizAttempt, QuizResult, QuizStats } from './quiz';
export type {
  ApiResponse,
  PaginatedResponse,
  SortOptions,
  FilterOptions,
  AsyncState,
  Notification,
  ConfirmDialog,
} from './common';
