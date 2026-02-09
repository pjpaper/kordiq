# React Hooks Deep Dive - KORDIQ Edition

## What We Built in Phase 3

### Custom Hooks Created:
1. **useFetch** - Generic hook for fetching any data from APIs
2. **useQuiz** - Specialized hook for quiz operations
3. **useAuth** - Handle user authentication, login, logout

---

## 🎯 The Master Concept: useEffect

`useEffect` is the **most important hook** to understand. It's how you connect your component to the outside world.

### What is a Side Effect?

A side effect is something that affects the world outside your component:
- Fetching data from an API
- Reading/writing to localStorage
- Setting up event listeners
- Starting timers (setTimeout, setInterval)
- Manipulating the DOM directly
- Calling analytics

### Why can't we do effects in component body?

```typescript
// ❌ WRONG - This runs EVERY render
const MyComponent = () => {
  const [count, setCount] = useState(0);
  
  // This fetch runs every single render!
  fetch('/api/data').then(res => res.json()).then(data => setData(data));
  
  return <div>{count}</div>;
};

// What happens:
// 1. Component renders → fetch starts
// 2. Component body ends, returns JSX
// 3. React renders JSX to screen
// 4. Meanwhile, fetch completes → setData() called
// 5. setData() causes state change
// 6. Component re-renders (back to step 1)
// 7. Infinite loop!
```

### The Solution: useEffect

```typescript
// ✅ CORRECT - fetch runs when you specify
const MyComponent = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(data => setData(data));
  }, []); // Empty dependency array = run once on mount
  
  return <div>{data}</div>;
};
```

---

## 🎯 The Critical Part: Dependency Arrays

This is where most React bugs come from. Let's break it down:

### Case 1: No Dependency Array

```typescript
useEffect(() => {
  console.log('This runs after EVERY render');
  fetch('/api/data');
});
```

**When it runs:** After EVERY render (dozens of times)

**Use cases:**
- Syncing component state with DOM (e.g., making sure input is focused)
- Responding to ANY value change

**Usually wrong for:** API calls (you don't want to fetch every render!)

### Case 2: Empty Dependency Array `[]`

```typescript
useEffect(() => {
  console.log('This runs ONCE on mount');
  fetch('/api/data');
}, []);
```

**When it runs:**
- ONCE when component mounts (appears on screen)
- NEVER again until component unmounts

**Use cases:**
- Fetch initial data
- Subscribe to real-time updates
- Initialize timers
- Set up event listeners

**Example in KORDIQ:**
```typescript
const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  
  useEffect(() => {
    // Load teacher's quizzes once when page loads
    fetch('/api/teacher/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data));
  }, []); // Empty array = load once
  
  return <div>{quizzes.map(q => <QuizCard key={q.id} quiz={q} />)}</div>;
};
```

### Case 3: Dependency Array With Values `[id, category]`

```typescript
useEffect(() => {
  console.log('This runs on mount and when id or category changes');
  fetch(`/api/quizzes?category=${category}&instructor=${id}`);
}, [id, category]); // Re-run if these change
```

**When it runs:**
- On mount
- When `id` changes
- When `category` changes
- NOT when other values change

**Why dependencies matter:**

```typescript
// ❌ WRONG - Missing dependency
const QuizDetail = ({ quizId }) => {
  useEffect(() => {
    fetchQuiz(quizId); // Uses quizId
  }, []); // But didn't include quizId!
  
  // What happens:
  // 1. Component mounts, quizId="123", fetch Quiz#123
  // 2. Parent changes quizId prop to "456"
  // 3. Component re-renders with new quizId
  // 4. But useEffect doesn't run again (empty dependency array!)
  // 5. Component still shows data for Quiz#123
  // 6. User is confused!
};

// ✅ CORRECT - Include dependency
const QuizDetail = ({ quizId }) => {
  useEffect(() => {
    fetchQuiz(quizId); // Uses quizId
  }, [quizId]); // Include quizId!
  
  // What happens:
  // 1. Component mounts, quizId="123", fetch Quiz#123
  // 2. Parent changes quizId prop to "456"
  // 3. Component re-renders with new quizId
  // 4. useEffect detects quizId changed
  // 5. Effect runs again, fetch Quiz#456
  // 6. Component shows correct data!
};
```

### Rule for Dependencies: The Exhaustive Dependency Linter

```typescript
// ✅ GOOD - Linter is happy
const StudentQuiz = ({ quizId, teacherId }) => {
  const [quiz, setQuiz] = useState(null);
  
  useEffect(() => {
    // This effect uses quizId
    // It also uses setQuiz (but that's okay, it never changes)
    fetchQuiz(quizId).then(setQuiz);
  }, [quizId]); // Include quizId! Don't include setQuiz (state setters never change)
};

// ❌ BAD - Missing dependency
const StudentQuiz = ({ quizId, teacherId }) => {
  useEffect(() => {
    // Forgot to include teacherId even though we use it!
    fetchQuiz(quizId, teacherId);
  }, [quizId]); // Missing teacherId!
};

// ✅ GOOD - Include teacherId
const StudentQuiz = ({ quizId, teacherId }) => {
  useEffect(() => {
    fetchQuiz(quizId, teacherId);
  }, [quizId, teacherId]); // Include both!
};
```

### Dependency Array Decision Tree

```
Does your effect USE a value from props or state?
  ↓
  YES → Include it in dependency array
  NO → Don't include it
  
Does the effect use a function defined outside the component?
  ↓
  Maybe → Memoize with useCallback or move outside component
  
Does the effect reference another effect's variable?
  ↓
  YES → Include it in dependency array
  NO → Don't include it
```

---

## 🎯 Cleanup Function (The Return Value)

The function returned from useEffect runs when:
1. Component unmounts (leaves the screen)
2. Before the effect runs again (if dependencies changed)

### Why is cleanup important?

```typescript
// ❌ MEMORY LEAK - No cleanup
const Timer = () => {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
  }, []);
  
  // User navigates away after 2 seconds
  // Timer still runs every 1 second forever!
  // (even though component is unmounted)
};

// ✅ CLEANUP - No memory leak
const Timer = () => {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    // Return cleanup function
    return () => {
      clearInterval(timer); // Stop timer on unmount
    };
  }, []);
};
```

### Cleanup Examples

```typescript
// Cleaning up event listeners
useEffect(() => {
  const handleClick = () => console.log('clicked');
  
  // Add listener
  window.addEventListener('click', handleClick);
  
  return () => {
    // Remove listener on cleanup
    window.removeEventListener('click', handleClick);
  };
}, []);

// Cleaning up timers
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('2 seconds passed');
  }, 2000);
  
  return () => clearTimeout(timer); // Cancel timer if component unmounts
}, []);

// Cleaning up subscriptions
useEffect(() => {
  const unsubscribe = store.subscribe(() => {
    console.log('Store changed');
  });
  
  return unsubscribe; // Stop listening on cleanup
}, []);

// Aborting fetch requests
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal });
  
  return () => controller.abort(); // Cancel fetch if component unmounts
}, []);
```

---

## 🎯 Common useEffect Patterns in KORDIQ

### Pattern 1: Fetch Data on Mount

```typescript
const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/quizzes')
      .then(res => res.json())
      .then(data => {
        setQuizzes(data);
        setLoading(false);
      });
  }, []); // Once on mount
  
  if (loading) return <Spinner />;
  return <QuizList quizzes={quizzes} />;
};
```

### Pattern 2: Refetch When ID Changes

```typescript
const QuizDetail = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    fetch(`/api/quizzes/${quizId}`)
      .then(res => res.json())
      .then(data => {
        setQuiz(data);
        setLoading(false);
      });
  }, [quizId]); // Re-run when quizId changes
  
  if (loading) return <Spinner />;
  return <QuizDetail quiz={quiz} />;
};
```

### Pattern 3: Debounced Search

```typescript
const QuizSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    // Don't search for empty term
    if (!searchTerm) {
      setResults([]);
      return;
    }
    
    // Debounce: wait 500ms after user stops typing
    const timer = setTimeout(() => {
      fetch(`/api/quizzes/search?q=${searchTerm}`)
        .then(res => res.json())
        .then(setResults);
    }, 500);
    
    return () => clearTimeout(timer); // Cancel previous search
  }, [searchTerm]); // Re-run when searchTerm changes
  
  return (
    <>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search quizzes..."
      />
      {results.map(q => <QuizCard key={q.id} quiz={q} />)}
    </>
  );
};
```

### Pattern 4: Multiple Effects

```typescript
const QuizTaker = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  
  // Effect 1: Load quiz
  useEffect(() => {
    fetch(`/api/quizzes/${quizId}`)
      .then(res => res.json())
      .then(setQuiz);
  }, [quizId]);
  
  // Effect 2: Auto-save every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      fetch(`/api/progress/${quizId}`, {
        method: 'POST',
        body: JSON.stringify(answers),
      });
    }, 30000);
    
    return () => clearInterval(timer);
  }, [quizId, answers]); // Re-setup when answers change
  
  // Each effect has ONE job
};
```

---

## 🎯 Understanding Our Hooks

### useFetch Breakdown

```typescript
export function useFetch<T>(url: string | null): AsyncState<T> & { refetch: () => void } {
  // Step 1: State for data, error, loading
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Step 2: Define fetch function with useCallback
  // (so function itself doesn't change, only re-creates if dependencies change)
  const executeFetch = useCallback(async () => {
    if (!url) return;
    
    setLoading(true);
    try {
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);
  
  // Step 3: useEffect runs executeFetch when url changes
  useEffect(() => {
    executeFetch();
  }, [url, executeFetch]);
  
  // Step 4: Return clean interface
  return { status, data, error, refetch: executeFetch };
}
```

### useQuiz Builds on useFetch

```typescript
export function useQuiz(quizId: string | null) {
  // Step 1: Use useFetch to get quiz data
  const fetchResult = useFetch<Quiz>(
    quizId ? `/api/quizzes/${quizId}` : null
  );
  
  // Step 2: Add quiz-specific state
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 3: Add quiz-specific operations
  const submitAnswers = useCallback(async () => {
    setIsSubmitting(true);
    const result = await fetch(`/api/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers: currentAnswers }),
    }).then(res => res.json());
    setIsSubmitting(false);
    return result;
  }, [quizId, currentAnswers]);
  
  // Step 4: Return wrapped interface
  return {
    quiz: fetchResult.data,
    loading: fetchResult.status === 'loading',
    setAnswer,
    submitAnswers,
  };
}
```

### useAuth Manages Authentication

```typescript
export function useAuth() {
  // Step 1: Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    // Load initial auth state
  }, []);
  
  // Step 2: Login function
  const login = useCallback(async (email, password) => {
    const { token, user } = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then(res => res.json());
    
    localStorage.setItem('auth_token', token);
    setState({ user, token, isAuthenticated: true });
  }, []);
  
  // Step 3: Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setState({ user: null, token: null, isAuthenticated: false });
  }, []);
  
  return { user, isAuthenticated, login, logout };
}
```

---

## 💡 Key Takeaways

1. **useEffect** = "Do this side effect and manage its lifecycle"
2. **Dependency array** = "Do this when these values change"
3. **Cleanup function** = "Undo everything when component unmounts"
4. **Custom hooks** = "Extract logic so components stay simple"
5. **Hook composition** = useFetch → useQuiz → Components

These patterns scale from the simplest component to massive SaaS applications like Stripe, Figma, and Notion.
