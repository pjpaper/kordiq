/**
 * Common/shared types and utilities
 * See: explanations/types/TypeSystem.md for details
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
  status: 'success' | 'error';
}

/**
 * Paginated list response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Sort configuration for list queries
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Filter options for list queries
 */
export interface FilterOptions {
  search?: string;
  skip?: number;
  limit?: number;
  sort?: SortOptions;
}

/**
 * Async State
 * 
 * Every async operation has these states:
 * Loading → Success or Error
 * 
 * We create a generic type for this pattern
 * so hooks can use it consistently.
 * 
 * EXAMPLE:
 * type FetchQuizState = AsyncState<Quiz>;
 * 
 * Then in a hook:
 * const [state, setState] = useState<AsyncState<Quiz>>({
 *   status: 'idle',
 *   data: null,
 *   error: null,
 * });
 */
export type AsyncState<T> = 
  | { status: 'idle' | 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: string };

/**
 * Notification Type
 * 
 * Toast messages, notifications, etc.
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number; // ms (null = don't auto-dismiss)
}

/**
 * Confirmation Dialog
 * 
 * Used for yes/no dialogs
 */
export interface ConfirmDialog {
  title: string;
  message: string;
  confirmText?: string; // "Delete" or "Yes"
  cancelText?: string;  // "Cancel" or "No"
  isDangerous?: boolean; // Red button if true
}
