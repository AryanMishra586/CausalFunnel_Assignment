# Quiz Application

A modern, fully-featured timed quiz application built with *Next.js 15, **TypeScript, **Tailwind CSS, and **shadcn/ui* components. This application provides an interactive quiz experience with 15 questions fetched from the Open Trivia Database API, complete with a countdown timer, real-time navigation, and comprehensive reporting.

## 🌟 Features

### Core Functionality

- *📧 Email-Based Start*: Users submit their email address on a start page before beginning the quiz
- *❓ 15 Questions*: Questions fetched dynamically from [Open Trivia Database API](https://opentdb.com/api.php?amount=15)
- *⏱️ 30-Minute Timer*: Countdown timer displayed prominently with auto-submit when time expires
- *🧭 Smart Navigation*:
  - Jump directly to any question number
  - Previous/Next buttons with smooth hover effects
  - Overview panel showing all questions at a glance
- *📊 Question Status Tracking*:
  - *Not Visited*: Questions not yet viewed (gray)
  - *Visited*: Questions viewed but not answered (blue)
  - *Attempted*: Questions with selected answers (primary color)
- *📋 Detailed Report Page*:
  - Side-by-side comparison of user answers vs correct answers
  - Color-coded feedback (green for correct, red for incorrect)
  - Overall score percentage and statistics
- *💾 State Persistence*: Quiz progress saved to localStorage (survives page refreshes)

### Bonus Features

- ✅ *Fully Responsive*: Adapts seamlessly to mobile, tablet, and desktop devices
- ✅ *Cross-Browser Compatible*: Tested on Chrome, Firefox, Safari, and Edge
- ✅ *Smooth Animations*: Transitions on button hovers, question navigation, and state changes
- ✅ *Enhanced UX*:
  - Entire option boxes are clickable (not just radio buttons)
  - Visual feedback on all interactive elements
  - Poppins font for modern, clean typography
  - Dark mode support

## 🏗️ Architecture & Approach

### Component Structure


app/
├── page.tsx                 # Start page (email capture)
├── quiz/page.tsx           # Main quiz interface
├── report/page.tsx         # Results and report page
└── api/questions/route.ts  # API proxy for OpenTDB

components/
├── quiz/
│   ├── quiz-provider.tsx      # Global state management with Context API
│   ├── question-card.tsx      # Individual question display with options
│   ├── question-overview.tsx  # Question grid navigation panel
│   └── timer.tsx             # Countdown timer component
└── ui/                       # shadcn/ui components (buttons, cards, etc.)

lib/
├── quiz-types.ts          # TypeScript interfaces and types
└── quiz-utils.ts          # Utility functions (HTML decode, shuffle)


### Key Components

#### 1. *QuizProvider* (components/quiz/quiz-provider.tsx)

- Centralized state management using React Context API
- Manages quiz state: questions, answers, visited status, timer, email
- Persists state to localStorage for data resilience
- Provides actions: selectAnswer, markVisited, goTo, submitQuiz, etc.

#### 2. *Timer* (components/quiz/timer.tsx)

- Real-time countdown from 30 minutes
- Calculates remaining time based on start timestamp (not interval-based)
- Auto-submits quiz when timer reaches zero
- Updates every second with precise time display

#### 3. *QuestionCard* (components/quiz/question-card.tsx)

- Displays question text and answer options
- Radio group for single-choice selection
- Entire option box is clickable for better UX
- Marks questions as visited on mount

#### 4. *QuestionOverview* (components/quiz/question-overview.tsx)

- Grid of buttons (1-15) for direct question navigation
- Visual indicators for visited/attempted status
- Current question highlighted with ring indicator
- Compact design to fit viewport alongside questions

### Data Flow

1. *Start Page*: User enters email → stored in QuizProvider
2. *Quiz Page*:
   - Fetches 15 questions from OpenTDB API
   - Decodes HTML entities in questions/answers
   - Shuffles answer options (correct + incorrect mixed)
   - User navigates and answers questions
   - Timer counts down from 30:00
3. *Report Page*:
   - Calculates score by comparing user answers with correct answers
   - Displays results with color-coded feedback

## 🚀 Setup & Installation

### Prerequisites

- *Node.js* 18+ or 20+
- *pnpm* (recommended) or npm

### Installation Steps

1. *Clone the repository*

   bash
   git clone <https://github.com/AryanMishra586/CausalFunnel_Assignment>
   cd quiz-app
   

2. *Install dependencies*

   bash
   pnpm install
   # or
   npm install
   

3. *Run development server*

   bash
   pnpm dev
   # or
   npm run dev
   

4. *Open in browser*
   
   http://localhost:3000
   

### Build for Production

bash
pnpm build
pnpm start


### Deploy

Deploy to *Vercel* (recommended):

bash
vercel


Or other platforms: Netlify, GitHub Pages, etc.

## 🎯 Data Source

Questions are fetched from the *Open Trivia Database API*:

- *API Endpoint*: https://opentdb.com/api.php?amount=15
- *Question Text*: question parameter
- *Answer Options*: Concatenated array of correct_answer + incorrect_answers (shuffled)
- *Correct Answer*: correct_answer parameter

### Data Processing

- HTML entities decoded using DOMParser API
- Answer options shuffled randomly using Fisher-Yates algorithm
- Questions normalized into a consistent format with unique IDs

## 📝 Assumptions

1. *Fixed Question Count*: Always 15 questions per quiz session
2. *Client-Side Only*: No backend database; all state managed client-side
3. *Single Session*: One active quiz session per browser (localStorage key)
4. *Network Reliability*: Assumes API is available (error handling included)
5. *Modern Browsers*: Targets browsers supporting ES6+ and modern CSS
6. *Local Time*: Timer uses device local time (not server-synced)

## 🧩 Challenges & Solutions

### Challenge 1: HTML Entity Encoding

*Problem*: OpenTDB API returns questions with HTML entities (e.g., &quot;, &#039;)

*Solution*: Created a decodeHtml() utility using DOMParser to convert HTML entities to readable text before displaying questions.

typescript
export function decodeHtml(html: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}


### Challenge 2: Timer Persistence Across Reloads

*Problem*: Timer should continue counting down even if the user refreshes the page

*Solution*: Store the startTime timestamp in localStorage rather than elapsed seconds. The timer calculates remaining time by comparing current time with start time.

typescript
const elapsed = Math.floor((Date.now() - startTime) / 1000);
const remaining = Math.max(durationSeconds - elapsed, 0);


### Challenge 3: Infinite Re-render Loop

*Problem*: QuestionCard component's useEffect was causing infinite updates due to unstable function references

*Solution*: Memoized callback props using useCallback to maintain stable function identity across renders.

typescript
const handleVisited = useCallback(() => {
  if (!q) return;
  markVisited(q.id);
}, [markVisited, q]);


### Challenge 4: Clickable Area for Radio Options

*Problem*: Only the small radio button was clickable, leading to poor UX

*Solution*: Wrapped entire option box in a <Label> element, making the full area clickable with proper cursor styling.

### Challenge 5: Visited vs Not-Visited Color Confusion

*Problem*: Visited and not-visited questions had similar gray colors

*Solution*: Implemented distinct color scheme:

- Not visited: Gray (bg-secondary)
- Visited: Blue (bg-blue-100)
- Attempted: Primary color

## 🎨 Code Quality

### Best Practices Followed

- ✅ *TypeScript*: Strict typing for all components and utilities
- ✅ *Component Reusability*: Modular, single-responsibility components
- ✅ *Performance*: useMemo, useCallback for optimized re-renders
- ✅ *Accessibility*: ARIA labels, semantic HTML, keyboard navigation
- ✅ *Error Handling*: Graceful fallbacks for API failures
- ✅ *Code Organization*: Clear separation of concerns (components, utils, types)
- ✅ *Consistent Styling*: Tailwind CSS with shadcn/ui design system
- ✅ *Clean Code*: Descriptive variable names, logical structure

## 🌐 Browser Compatibility

Tested and working on:

- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

## 📱 Responsive Design

- *Mobile* (< 768px): Single column layout, touch-optimized buttons
- *Tablet* (768px - 1024px): Adaptive grid, collapsible overview
- *Desktop* (> 1024px): Side-by-side question and overview panel


## 👨‍💻 Author

Built with ❤️ using Next.js, TypeScript, and modern web technologies.

---

*Live Demo*: https://causal-funnel-assignment-beige.vercel.app/

*Repository*: https://github.com/AryanMishra586/CausalFunnel_Assignment

*Video Preview*: https://drive.google.com/file/d/1d6Ing-jZcakXlU0GZIFeqGeFqAPO1tJs/view?usp=sharing