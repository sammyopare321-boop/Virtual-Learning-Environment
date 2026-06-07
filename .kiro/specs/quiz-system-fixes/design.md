# Design Document: Quiz System Fixes

## Overview

This document describes the technical design for fixing 5 critical bugs and implementing 5 improvements in the VLE Quiz System. All changes are surgical and scoped to existing files — no new routes files, no new models (except a new route handler and a new frontend component). The stack is Node.js/Express/MongoDB on the backend and Next.js/TypeScript on the frontend.

---

## Architecture

The quiz system follows a standard MVC pattern:

```
Frontend (Next.js)
  └─ page.tsx  (quiz detail page — orchestrates data fetching, timer, submit)
  └─ ImmersiveQuizPlayer.tsx  (full-screen quiz-taking UI)
  └─ extraApis.ts  (Axios helper wrappers)

Backend (Express)
  └─ routes/quizzes.js  (route definitions + middleware wiring)
  └─ controllers/quizController.js  (CRUD for quizzes)
  └─ controllers/questionController.js  (CRUD for questions)
  └─ controllers/quizAttemptController.js  (attempt lifecycle + grading)
  └─ middleware/validation.js  (Joi schemas)

MongoDB Collections
  └─ quizzes  →  questions  →  quizattempts  →  gradeitems
```

Each bug/improvement maps to one or two specific files. The changes are designed to be applied independently without cross-cutting refactors.

---

## Components and Interfaces

### Bug 1 — Cascade Delete (`quizController.js`)

**Current behaviour**: `deleteQuiz` calls `quiz.deleteOne()` and returns. Questions, QuizAttempts, and GradeItems with `quiz` / `sourceId` set to the deleted quiz ID are left as orphans.

**Fix**: After `quiz.deleteOne()`, run three additional deletes in parallel using `Promise.all`:

```js
await Promise.all([
  Question.deleteMany({ quiz: quiz._id }),
  QuizAttempt.deleteMany({ quiz: quiz._id }),
  GradeItem.deleteMany({ sourceId: quiz._id, sourceType: 'quiz' }),
]);
```

Dependencies `Question`, `QuizAttempt`, and `GradeItem` must be imported at the top of `quizController.js`.

---

### Bug 2 — Auto-Submit Sends Empty Answers (`page.tsx` + `ImmersiveQuizPlayer.tsx`)

**Root cause (two parts)**:

1. In `page.tsx`, the `handleFinalSubmit` called from the `useEffect` timer is `handleFinalSubmit({})` — it passes an empty object directly. This bypasses the answers state held inside `ImmersiveQuizPlayer`.
2. The timer `useEffect` in `page.tsx` calls `handleFinalSubmit({})` when `timeLeft === 0`. Because `handleFinalSubmit` is a `useCallback` defined in the same component and `answers` live inside `ImmersiveQuizPlayer`, the page-level callback has no access to the current answers.

**Fix**:

- Move the timer management **into** `ImmersiveQuizPlayer` (it already receives `timeLeft` as a prop and holds `answers` in state).
- The existing `useEffect` in `ImmersiveQuizPlayer` already calls `handleFinalSubmit()` (the internal wrapper) when `timeLeft === 0`. This is correct — it has access to the local `answers` state.
- Remove the `handleFinalSubmit({})` call from the `useEffect` in `page.tsx`. The page-level timer `useEffect` should only update `timeLeft` state; the actual submit should be triggered by the player.
- The `onSubmit` prop on `ImmersiveQuizPlayer` should continue to accept `Record<string, string>`, which is mapped to the answers array in `page.tsx`'s `handleFinalSubmit`.

**Updated data flow**:
```
page.tsx: timer tick → setTimeLeft(left)
ImmersiveQuizPlayer: useEffect[timeLeft] → when 0 → handleFinalSubmit() → onSubmit(answers)
page.tsx: onSubmit(answers) → transform to array → quizApi.submitAttempt
```

---

### Bug 3 — submitQuizSchema Too Strict (`validation.js`)

**Current**: `answers` is `.min(1).required()` — rejects empty arrays.

**Fix**: Change to `.min(0).default([])`:

```js
const submitQuizSchema = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.string().required(),
      answer: Joi.string().allow('').required()
    })
  ).min(0).default([])
});
```

The `default([])` also handles the case where `answers` is absent from the body entirely (Bug 3, criterion 3).

The `submitAttempt` controller already handles an empty array gracefully — iterating over zero answers leaves `score = 0` and `hasShortAnswer = false`, producing `status: 'graded'`.

---

### Bug 4 — gradeAttempt API Mismatch (`extraApis.ts`)

**Current**: `gradeAttempt: (attemptId, { score, feedback }) => ...`

**Backend expects**: `{ scoreAdjustment, feedback }`

**Fix**: Update the type signature and payload key:

```ts
gradeAttempt: (attemptId: string, data: { scoreAdjustment: number; feedback?: string }) =>
  api.patch(`/api/v1/attempts/${attemptId}/grade`, data),
```

No backend change needed — the controller already reads `scoreAdjustment`.

---

### Bug 5 — ImmersiveQuizPlayer Crash (`page.tsx`)

**Root cause**: When `handleStart` resolves, it calls `setAttempt(newAttempt)` and conditionally `setQuestions(startQuestions)`. React batches state updates, but the page render condition `isStudent && attempt?.status === 'in_progress'` can evaluate to `true` before `questions` state is set (especially if `startQuestions` is undefined/empty from a network lag), causing `ImmersiveQuizPlayer` to receive an empty `questions` array.

The existing loading guard in `ImmersiveQuizPlayer` renders a spinner when `!questions.length || !currentQ`, which is the correct short-term guard. The deeper fix is in `page.tsx`:

- Only set `attempt` after questions are confirmed to be loaded:
  ```tsx
  if (startQuestions?.length) {
    setQuestions(startQuestions);
    setAttempt(newAttempt);  // set attempt AFTER questions are ready
  } else {
    // fallback: fetch questions separately before mounting player
    const qRes = await quizApi.getQuestions(quizId);
    setQuestions(qRes.data.data);
    setAttempt(newAttempt);
  }
  ```
- Add a guard in the render: only mount `ImmersiveQuizPlayer` when `questions.length > 0`:
  ```tsx
  if (isStudent && attempt?.status === 'in_progress' && questions.length > 0) {
    return <ImmersiveQuizPlayer ... />;
  }
  if (isStudent && attempt?.status === 'in_progress' && questions.length === 0) {
    return <LoadingSpinner message="Loading questions..." />;
  }
  ```

---

### Improvement 6 — Answer Review for Students (`page.tsx`)

After a quiz attempt is graded or submitted, the student result card currently shows only the total score. 

**Addition**: Expand the result view to iterate over `attempt.answers` and cross-reference with the `questions` array. For each question, show:
- Question text
- Student's submitted answer
- Whether it was correct (green check) or incorrect (red cross) — only for `multiple_choice` and `true_false` types
- For `short_answer`, show the response text and any `attempt.feedback`

The `questions` array is already in state. The `attempt.answers` array is returned from the submit and stored in state.

For the correct-answer comparison, the `correctAnswer` field is stripped by `select: false` in the Question model, so the frontend cannot directly compare. Instead, the `submitAttempt` controller should include per-question correctness in the response when returning a graded attempt. A new `answerResults` array will be added to the response shape:

```js
// In submitAttempt controller, build results for non-short-answer questions
const answerResults = answers.map(ans => {
  const question = questions.find(q => q._id.toString() === ans.questionId);
  if (!question || question.type === 'short_answer') {
    return { questionId: ans.questionId, correct: null };
  }
  return { questionId: ans.questionId, correct: question.correctAnswer === ans.answer };
});
// Attach to response (not persisted in DB)
res.status(200).json({ success: true, data: { ...attempt.toObject(), answerResults } });
```

The frontend stores `answerResults` alongside the attempt and renders the review panel.

---

### Improvement 7 — Quiz Reset by Teacher (`quizAttemptController.js` + `routes/quizzes.js` + `page.tsx`)

**New backend endpoint**: `DELETE /quizzes/:quizId/attempts/:studentId`

Controller `resetAttempt`:
1. Find `QuizAttempt` by `{ quiz: quizId, student: studentId }` — 404 if not found.
2. Verify the requesting user is teacher/admin and owns the course — 403 if not.
3. `await attempt.deleteOne()`
4. `await GradeItem.deleteOne({ sourceId: quizId, student: studentId })`
5. Return 200.

Frontend: add a "Reset attempt" button per row in the teacher submissions list. Clicking calls `quizApi.resetAttempt(quizId, studentId)` then invalidates the query.

New API helper:
```ts
resetAttempt: (quizId: string, studentId: string) =>
  api.delete(`/api/v1/quizzes/${quizId}/attempts/${studentId}`),
```

---

### Improvement 8 — Auto-Save to LocalStorage (`ImmersiveQuizPlayer.tsx`)

**Implementation**:

- On mount, read `localStorage.getItem(`quiz-draft-${attempt._id}`)`. If found, parse and hydrate the `answers` state (only if the attempt is still `in_progress`).
- A `useEffect` on `answers` debounced to fire at most every 30 seconds writes `localStorage.setItem(`quiz-draft-${attempt._id}`, JSON.stringify(answers))`.
- On successful `onSubmit`, call `localStorage.removeItem(`quiz-draft-${attempt._id}`)`.
- The footer already shows "Auto-Save Active" — this will make it functional.

```tsx
// Save draft (throttled)
useEffect(() => {
  const id = setTimeout(() => {
    localStorage.setItem(`quiz-draft-${attempt._id}`, JSON.stringify(answers));
  }, 30_000);
  return () => clearTimeout(id);
}, [answers, attempt._id]);
```

---

### Improvement 9 — Short-Answer Grading UI (`page.tsx`)

In the teacher's submissions list, each attempt row with `status === 'submitted'` will have a "Grade" button. Clicking it opens an inline panel (not a separate route) that shows:
- All questions from the quiz
- The student's answer for each question
- A `scoreAdjustment` number input (can be negative for partial credit)
- An optional `feedback` textarea
- A "Submit Grade" button

On submission, calls `quizApi.gradeAttempt(attempt._id, { scoreAdjustment, feedback })`. On success, the attempt row updates to `graded` with the new score.

---

### Improvement 10 — Restrict Questions for Unpublished Quizzes (`questionController.js`)

**Fix in `getQuestions`**:

```js
exports.getQuestions = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  // Students cannot access questions for unpublished quizzes
  if (!quiz.isPublished && req.user.role === 'student') {
    return res.status(403).json({ success: false, message: 'This quiz has not been published yet' });
  }

  const questions = await Question.find({ quiz: req.params.id }).sort('order');
  res.status(200).json({ success: true, count: questions.length, data: questions });
});
```

Teachers and admins are unaffected (they need to see questions regardless of publish state).

---

## Data Models

No schema changes are required. All fixes work with existing MongoDB document shapes.

The only addition is a transient `answerResults` field attached to the `submitAttempt` response payload (not persisted to the `QuizAttempt` document).

```
QuizAttempt (existing)
  answers: [{ questionId, answer }]
  score: Number
  totalMarks: Number
  percentage: Number
  status: 'in_progress' | 'submitted' | 'graded'
  feedback: String

submitAttempt response (extended, not persisted)
  ...attempt fields
  answerResults: [{ questionId: String, correct: Boolean | null }]
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Cascade delete removes all related documents

*For any* quiz that exists in the database, after a teacher deletes it, the database should contain zero Question documents, zero QuizAttempt documents, and zero GradeItem documents that reference that quiz's ID.

**Validates: Requirements 1.1, 1.2, 1.3**

---

### Property 2: Auto-submit preserves answered questions

*For any* set of answers accumulated by a student during a quiz session, when the timer reaches zero and auto-submit is triggered, the submitted answers array should be equal to the answers collected at the moment of auto-submit (not an empty collection).

**Validates: Requirements 2.1, 2.2**

---

### Property 3: Submit with empty answers produces zero-score graded attempt

*For any* quiz with only non-short-answer questions, submitting an empty answers array should produce an attempt with `score = 0` and `status = 'graded'`.

**Validates: Requirements 3.1, 3.2**

---

### Property 4: gradeAttempt score adjustment is bounded

*For any* submitted attempt and any scoreAdjustment value, the final attempt score after grading should be clamped to the range `[0, totalMarks]`.

**Validates: Requirements 4.1, 4.2, 4.3**

---

### Property 5: Answer results correctness

*For any* quiz submission with known-correct and known-incorrect answers, the `answerResults` in the response should correctly classify each non-short-answer question as `correct: true` or `correct: false`, and short-answer questions as `correct: null`.

**Validates: Requirements 6.1**

---

### Property 6: LocalStorage draft round-trip

*For any* set of in-progress answers, writing them to LocalStorage and reading them back should produce an equivalent answers object.

**Validates: Requirements 8.2, 8.4**

---

### Property 7: Question access control by publish status

*For any* quiz and any student user, requesting questions for an unpublished quiz should return a 403, and requesting questions for a published quiz should return 200 with the questions.

**Validates: Requirements 10.1, 10.3**

---

### Property 8: Reset attempt idempotency on re-take

*For any* quiz where a student's attempt has been reset, the student should have no existing attempt, and calling start again should create a fresh attempt with `status = 'in_progress'`.

**Validates: Requirements 7.1, 7.6**

---

## Error Handling

| Scenario | HTTP Status | Message |
|---|---|---|
| Quiz not found on delete | 404 | "Quiz not found" |
| Attempt not found on reset | 404 | "Attempt not found" |
| Non-teacher attempts reset | 403 | "Not authorized" |
| Student fetches unpublished quiz questions | 403 | "This quiz has not been published yet" |
| Submit with missing answers field | 200 (answers defaults to []) | — |
| gradeAttempt already graded | 400 | "Attempt has already been graded" |
| ImmersiveQuizPlayer questions not loaded | Renders loading spinner | — |

---

## Testing Strategy

### Unit Tests

- `submitAttempt` controller: test score calculation with full answers, partial answers, and empty answers array
- `deleteQuiz` controller: mock DB calls, verify `deleteMany` is called for Question, QuizAttempt, and GradeItem
- `getQuestions` controller: test student/teacher access for published and unpublished quiz
- `gradeAttempt` controller: test score clamping at 0 and totalMarks boundaries
- `submitQuizSchema`: test that `answers: []` and absent `answers` both pass validation

### Property-Based Tests

Use a property-based testing library (e.g., **fast-check** for the Node.js backend, or within a Jest test suite for the frontend). Each test should run a minimum of **100 iterations**.

Each property test is tagged: `Feature: quiz-system-fixes, Property N: <property text>`

- **Property 1** — Generate random sets of quiz IDs; insert documents across all three collections; delete the quiz; assert counts are zero.
- **Property 2** — Generate random `answers` maps; simulate timer expiry; assert submitted answers array length equals generated map size.
- **Property 3** — Submit empty answers array to any quiz with only MCQ/true-false questions; assert `score === 0` and `status === 'graded'`.
- **Property 4** — Generate random `scoreAdjustment` values (positive and negative, including extremes); assert result is always within `[0, totalMarks]`.
- **Property 5** — Generate quiz/question/answer combinations with known correct answers; assert every `answerResults` entry matches expected correctness.
- **Property 6** — Generate random answer objects; serialize to JSON and parse back; assert deep equality.
- **Property 7** — Generate student/teacher users and published/unpublished quizzes; assert 403 iff student + unpublished, 200 otherwise.
- **Property 8** — Create attempt, reset it, then start again; assert fresh attempt exists with `in_progress` status and no old answers.
