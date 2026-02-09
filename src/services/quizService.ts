import type { Quiz, QuizResult, QuizAttempt } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Get authorization header with Bearer token
 */
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('kordiq_auth_token');
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Handle API response with error handling
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    } catch {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
}

/**
 * Get all quizzes for current user
 * See: explanations/services/quizService.md for details
 */
export async function getQuizzes(): Promise<Quiz[]> {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    headers: getAuthHeader(),
  });
  return handleResponse<Quiz[]>(response);
}

/**
 * Get a single quiz by ID
 */
export async function getQuiz(quizId: string): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
    headers: getAuthHeader(),
  });
  return handleResponse<Quiz>(response);
}

/**
 * Search quizzes by title or tags
 */
export async function searchQuizzes(
  searchTerm: string,
  filters?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  }
): Promise<Quiz[]> {
  const params = new URLSearchParams();
  params.append('q', searchTerm);

  if (filters?.difficulty) {
    params.append('difficulty', filters.difficulty);
  }
  if (filters?.tags) {
    params.append('tags', filters.tags.join(','));
  }

  const response = await fetch(`${API_BASE_URL}/quizzes/search?${params}`, {
    headers: getAuthHeader(),
  });
  return handleResponse<Quiz[]>(response);
}

/**
 * Create a new quiz
 */
export async function createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(quizData),
  });
  return handleResponse<Quiz>(response);
}

/**
 * Update an existing quiz
 */
export async function updateQuiz(quizId: string, quizData: Partial<Quiz>): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(quizData),
  });
  return handleResponse<Quiz>(response);
}

/**
 * Delete a quiz (teacher only)
 */
export async function deleteQuiz(quizId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete quiz');
  }
}

/**
 * Publish a quiz (make available to students)
 */
export async function publishQuiz(quizId: string): Promise<Quiz> {
  return updateQuiz(quizId, { isPublished: true });
}

/**
 * Unpublish a quiz (hide from students)
 */
export async function unpublishQuiz(quizId: string): Promise<Quiz> {
  return updateQuiz(quizId, { isPublished: false });
}

/**
 * Submit quiz answers and get results with grading
 */
export async function submitQuizAnswers(
  quizId: string,
  answers: Record<string, string>
): Promise<QuizResult> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ answers, submittedAt: new Date() }),
  });
  return handleResponse<QuizResult>(response);
}

/**
 * Save quiz progress for resume-able quizzes
 */
export async function saveQuizProgress(
  quizId: string,
  answers: Record<string, string>
): Promise<{ savedAt: Date }> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ answers, timestamp: new Date() }),
  });
  return handleResponse<{ savedAt: Date }>(response);
}

/**
 * Get all attempts at a quiz
 */
export async function getQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/attempts`, {
    headers: getAuthHeader(),
  });
  return handleResponse<QuizAttempt[]>(response);
}

/**
 * Get the highest scoring attempt at a quiz
 */
export async function getBestAttempt(quizId: string): Promise<QuizResult> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/best-attempt`, {
    headers: getAuthHeader(),
  });
  return handleResponse<QuizResult>(response);
}
