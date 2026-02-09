/**
 * KORDIQ - Smart Adaptive EdTech Quiz Platform
 * 
 * This is the root component of our application.
 * Every other component is rendered somewhere inside here.
 * 
 * PHASE 4 UPDATE:
 * Wrapped with ApolloProvider to enable GraphQL/Apollo Client
 * across the entire application.
 */

import { useState } from 'react';
// TODO: Fix Apollo Client import
// import { ApolloProvider } from '@apollo/client';
// import { apolloClient } from '@/graphql/apolloClient';
import { Button, Card, Badge, Input } from '@/components/common';
import type { Quiz } from '@/types';
import './App.css';

/**
 * App Component - The Root of Our Application
 * 
 * WHAT IS App.tsx?
 * - Rendered in main.tsx via createRoot(document.getElementById('root')).render(<App />)
 * - Top-level component that wraps everything else
 * - Where you'd put global providers (Apollo Client, Auth Context, etc.)
 * 
 * CURRENT STRUCTURE:
 * App
 * ├── Header/Navigation (to be built)
 * ├── Routes (to be built)
 * └── Footer (to be built)
 */

function App() {
  /**
   * STATE MANAGEMENT
   * 
   * WHAT IS useState?
   * A React Hook that lets functional components use state.
   * State = data that changes over time
   * 
   * SYNTAX: const [value, setValue] = useState(initialValue);
   * - value: current state value
   * - setValue: function to update it
   * - initialValue: what value starts with
   * 
   * WHY setState (function) instead of just value?
   * React needs to know when state changes so it can re-render.
   * Direct mutation (value = newValue) won't trigger re-render.
   * If we do value.push(item) directly, React won't know to re-render.
   * 
   * This is THE FUNDAMENTAL RULE OF REACT:
   * Don't mutate state directly. Use setState to tell React "value changed!"
   * 
   * EXAMPLE WRONG:
   * const title = "Quiz 1";
   * title = "Quiz 2"; // This doesn't trigger re-render!
   * 
   * CORRECT:
   * const [title, setTitle] = useState("Quiz 1");
   * setTitle("Quiz 2"); // React detects change and re-renders
   */

  // Controlled input state - for the Input component demo
  const [quizTitle, setQuizTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * SAMPLE DATA - In a real app, this comes from Apollo Client / Services
   * But for now, we'll use static data to showcase components
   */
  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Biology Basics',
      description: 'Learn the fundamentals of cell structure',
      questions: [],
      createdBy: 'teacher-1',
      isPublished: true,
      difficulty: 'easy',
      timeLimit: 30,
      tags: ['science', 'biology'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Advanced Chemistry',
      description: 'Periodic table and chemical reactions',
      questions: [],
      createdBy: 'teacher-1',
      isPublished: true,
      difficulty: 'hard',
      timeLimit: 60,
      tags: ['science', 'chemistry'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  /**
   * EVENT HANDLER - What happens when user submits form
   * 
   * WHY separate function?
   * Makes code more readable and testable.
   * 
   * FLOW:
   * User clicks button → onClick fires → handleCreateQuiz
   * If we use async, then await fetch/API call
   * Then show success message
   * 
   * IN A REAL APP:
   * const response = await quizService.createQuiz({ title: quizTitle });
   * if (response.error) showErrorMessage(response.error);
   * else showSuccessMessage(response.data);
   */
  const handleCreateQuiz = async () => {
    if (!quizTitle.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    alert(`Quiz "${quizTitle}" created successfully!`);
    setQuizTitle(''); // Clear input
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-primary-600">KORDIQ</h1>
          <p className="text-sm text-gray-600">Smart Adaptive EdTech Platform</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* SECTION 1: Creating a Quiz - Shows Input, Button Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Quiz</h2>
          <Card padding="lg">
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent page refresh
                handleCreateQuiz();
              }}
            >
              {/* 
                INPUT COMPONENT
                This demonstrates:
                1. Controlled component (value + onChange)
                2. Form validation props (error, helperText)
                3. How to compose components together
                
                CONTROLLED COMPONENT FLOW:
                1. User types → onChange fires
                2. setQuizTitle updates React state
                3. React re-renders Input with new value
                4. Input displays the new value
                
                This is how React "controls" the input!
              */}
              <Input
                label="Quiz Title"
                placeholder="e.g., 'Biology Basics'"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                disabled={isSubmitting}
                helperText="Give your quiz a clear, descriptive title"
                required
              />

              {/* 
                BUTTON COMPONENT
                Shows:
                1. isLoading state (shows spinner while submitting)
                2. variant="primary" (blue button)
                3. size="lg" (larger button for important actions)
              */}
              <Button
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                disabled={!quizTitle.trim() || isSubmitting}
                onClick={handleCreateQuiz}
                className="mt-4"
              >
                {isSubmitting ? 'Creating...' : 'Create Quiz'}
              </Button>
            </form>
          </Card>
        </section>

        {/* SECTION 2: Quiz List - Shows Card, Badge Components */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Quizzes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleQuizzes.map((quiz) => (
              <Card
                key={quiz.id}
                isClickable
                padding="md"
                header={<h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>}
                footer={
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                    <Button variant="primary" size="sm">
                      Take Quiz
                    </Button>
                  </div>
                }
              >
                <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>

                {/* Badge showcase */}
                <div className="flex flex-wrap gap-2">
                  {quiz.isPublished ? (
                    <Badge variant="success">Published</Badge>
                  ) : (
                    <Badge variant="warning">Draft</Badge>
                  )}
                  <Badge variant="info">{quiz.difficulty}</Badge>
                  <Badge variant="info">{quiz.timeLimit} min</Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* INFO SECTION - Educational */}
        <section className="mt-12 bg-blue-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-3">📚 Learning Notes</h3>
          <ul className="space-y-2 text-sm text-primary-800">
            <li>
              ✅ <strong>useState:</strong> Allows functional components to have state. When state changes,
              React re-renders the component.
            </li>
            <li>
              ✅ <strong>Controlled Components:</strong> Input element whose value is managed by React state.
              Allows real-time validation and control.
            </li>
            <li>
              ✅ <strong>Composition:</strong> We build small components (Button, Card, Badge) and combine them
              into larger components. This is the power of React!
            </li>
            <li>
              ✅ <strong>Event Handlers:</strong> onClick, onChange, onSubmit - these connect user actions to
              your JavaScript code.
            </li>
            <li>
              ✅ <strong>Barrel Exports:</strong> Import multiple components cleanly from index.ts files.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
