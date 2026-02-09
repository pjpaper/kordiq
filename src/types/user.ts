/**
 * User interface - Core authentication entity
 * See: explanations/types/TypeSystem.md for details
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'teacher' | 'student' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Teacher - User with teaching permissions and metadata
 */
export interface Teacher extends User {
  role: 'teacher';
  schoolName?: string;
  subject?: string;
  bio?: string;
}

/**
 * Student - User with enrollment and progress tracking
 */
export interface Student extends User {
  role: 'student';
  gradeLevel?: string;
  enrolledIn: string[]; // Quiz IDs they're enrolled in
}

/**
 * Token returned on successful authentication
 */
export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // seconds
}

/**
 * Authentication state managed by useAuth hook
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
