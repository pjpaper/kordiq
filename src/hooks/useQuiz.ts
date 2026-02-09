import { useState, useCallback } from 'react';
import type { Quiz, QuizResult } from '@/types';
import { useFetch } from './useFetch';

interface UseQuizOptions {
  baseUrl?: string;
  autoSaveInterval?: number;
}

/**
 * Hook for managing a single quiz with submission and progress tracking
 * Composes useFetch for data fetching with domain-specific quiz logic
 * See: explanations/hooks/useQuiz.md for detailed explanation
 * 
 * @param quizId - The ID of the quiz to load (null = don't fetch)
 * @param options - Optional configuration
 * @returns { quiz, loading, error, currentAnswers, setAnswer, resetAnswers, submitAnswers, saveProgress }
 */
export function useQuiz(quizId: string | null, options?: UseQuizOptions) {
  const baseUrl = options?.baseUrl || 'http://localhost:4000/api';

  const fetchResult = useFetch<Quiz>(
    quizId ? `${baseUrl}/quizzes/${quizId}` : null
  );

  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitAnswers = useCallback(async () => {
    if (!quizId) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${baseUrl}/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: currentAnswers,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit quiz: ${response.statusText}`);
      }

      const result: QuizResult = await response.json();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setSubmitError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, currentAnswers, baseUrl]);

  const saveProgress = useCallback(async () => {
    if (!quizId) return;

    try {
      const response = await fetch(`${baseUrl}/quizzes/${quizId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: currentAnswers,
          timestamp: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save progress: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }, [quizId, currentAnswers, baseUrl]);

  const setAnswer = useCallback((questionId: string, answer: string) => {
    setCurrentAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  const resetAnswers = useCallback(() => {
    setCurrentAnswers({});
  }, []);

  return {
    quiz: fetchResult.data,
    loading: fetchResult.status === 'loading',
    error: fetchResult.error || submitError,
    currentAnswers,
    setAnswer,
    resetAnswers,
    isSubmitting,
    submitAnswers,
    saveProgress,
    refetch: fetchResult.refetch,
  };
}
