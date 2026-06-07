# Implementation Plan: Quiz System Fixes

## Overview

Implement 5 bug fixes and 5 improvements in the VLE quiz system. All changes are surgical and confined to the files identified in the design. The backend uses Node.js/Express/MongoDB; the frontend uses Next.js/TypeScript. Tasks are ordered so bugs are fixed before improvements, and each task is self-contained.

## Tasks

- [x] 1. Fix cascade delete in quizController.js
  - Import `Question`, `QuizAttempt`, and `GradeItem` models at the top of `backend/src/controllers/quizController.js`
  - In the `deleteQuiz` handler, after `await quiz.deleteOne()`, add a `Promise.all` that runs `Question.deleteMany({ quiz: quiz._id })`, `QuizAttempt.deleteMany({ quiz: quiz._id })`, and `GradeItem.deleteMany({ sourceId: quiz._id, sourceType: 'quiz' })`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 1.1 Write property test for cascade delete
    - **Property 1: Cascade delete removes all related documents**
    - Generate a quiz with random questions, attempts, and grade items; call deleteQuiz; assert counts are zero for all three collections
    - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 2. Fix submitQuizSchema to allow empty answers
  - In `backend/src/middleware/validation.js`, change `submitQuizSchema` answers field from `.min(1).required()` to `.min(0).default([])`
  - Verify the `submitAttempt` controller handles an empty `answers` array gracefully (produces `score = 0`, `status = 'graded'`)
  - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 2.1 Write property test for submitQuizSchema
    - **Property 3: Submit with empty answers produces zero-score graded attempt**
    - Test schema validation with arrays of 0 to N items; test controller with empty array; assert score=0 and status=graded
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 3. Fix auto-submit to pass current answers
  - In `frontend/app/(dashboard)/courses/[courseId]/quizzes/[quizId]/page.tsx`, remove the `handleFinalSubmit({})` call inside the timer `useEffect` — the timer should only call `setTimeLeft` and `clearInterval`
  - In `frontend/components/learning/ImmersiveQuizPlayer.tsx`, confirm the existing `useEffect` on `timeLeft` calls the internal `handleFinalSubmit()` (which uses the local `answers` state) — no changes needed if already correct
  - The `onSubmit` prop signature remains `(answers: Record<string, string>) => Promise<void>`
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 3.1 Write property test for auto-submit answers capture
    - **Property 2: Auto-submit preserves answered questions**
    - Render ImmersiveQuizPlayer with a populated answers state; simulate timeLeft reaching 0; assert the onSubmit spy receives the populated answers
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 3.2 Write unit test for duplicate submit prevention
    - Simulate timeLeft reaching 0 twice rapidly; assert onSubmit is called exactly once
    - **Validates: Requirements 2.4**

- [x] 4. Fix gradeAttempt API field name mismatch
  - In `frontend/utils/api/extraApis.ts`, update `gradeAttempt` to send `{ scoreAdjustment, feedback }` instead of `{ score, feedback }`
  - Update the TypeScript type signature: `data: { scoreAdjustment: number; feedback?: string }`
  - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 4.1 Write property test for score adjustment clamping
    - **Property 4: gradeAttempt score adjustment is bounded**
    - Generate random (score, totalMarks, scoreAdjustment) triples; call gradeAttempt; assert result is always in [0, totalMarks]
    - **Validates: Requirements 4.2, 4.3**

- [x] 5. Fix ImmersiveQuizPlayer question load guard
  - In `page.tsx` `handleStart`, reorder the state updates so `setQuestions(startQuestions)` is called before `setAttempt(newAttempt)`, ensuring questions are in state when the player mounts
  - Add a fallback: if `startQuestions` is empty, fetch questions via `quizApi.getQuestions(quizId)` before calling `setAttempt`
  - In the render, change the player mount condition to `isStudent && attempt?.status === 'in_progress' && questions.length > 0`; add an adjacent condition that renders a loading spinner when `attempt?.status === 'in_progress' && questions.length === 0`
  - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 5.1 Write unit tests for question load guard
    - Test that ImmersiveQuizPlayer renders loading spinner when questions prop is empty
    - Test that the player is not rendered in page.tsx when questions.length === 0 and attempt is in_progress
    - **Validates: Requirements 5.1, 5.2**

- [x] 6. Checkpoint — ensure all tests pass
  - Ensure all tests pass; ask the user if questions arise.

- [x] 7. Add answerResults to submitAttempt response
  - In `backend/src/controllers/quizAttemptController.js`, in `submitAttempt`, after computing score, build an `answerResults` array: for each submitted answer, find the matching question; if `multiple_choice` or `true_false`, set `correct: question.correctAnswer === ans.answer`; if `short_answer`, set `correct: null`
  - Attach `answerResults` to the response payload: `res.status(200).json({ success: true, data: { ...attempt.toObject(), answerResults } })`
  - Do not persist `answerResults` to the `QuizAttempt` document
  - _Requirements: 6.1_

  - [ ]* 7.1 Write property test for answerResults correctness
    - **Property 5: Answer results correctness**
    - Generate quiz questions with known correctAnswers and student answer submissions (some correct, some wrong, some short_answer); call submitAttempt; assert every answerResults entry matches expected correct/null values
    - **Validates: Requirements 6.1**

- [x] 8. Implement answer review UI for students
  - In `page.tsx`, store `answerResults` from the `handleFinalSubmit` response alongside `attempt` state
  - Replace the post-submit "Quiz Submitted" card with a detailed result panel that, when `attempt.status === 'graded'`, maps each question to the student's answer and shows a green check or red cross for MCQ/true-false questions
  - For short-answer questions, show the student's response text and `attempt.feedback`
  - When `attempt.status === 'submitted'`, show only the "Pending manual grading" message
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 8.1 Write unit tests for answer review display
    - Test that graded attempt with correct/incorrect answers renders correct icons
    - Test that short-answer questions show feedback text
    - Test that status=submitted renders pending message
    - **Validates: Requirements 6.2, 6.3, 6.4**

- [x] 9. Implement quiz reset endpoint (backend)
  - Add `resetAttempt` controller function to `backend/src/controllers/quizAttemptController.js`
    - Find attempt by `{ quiz: req.params.quizId, student: req.params.studentId }` — 404 if not found
    - Verify requesting user is teacher/admin who owns the course — 403 if not
    - `await attempt.deleteOne()`
    - `await GradeItem.deleteOne({ sourceId: req.params.quizId, student: req.params.studentId })`
    - Return 200
  - Register route in `backend/src/routes/quizzes.js`: `DELETE /quizzes/:quizId/attempts/:studentId`
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 9.1 Write property test for attempt reset
    - **Property 8: Reset attempt idempotency on re-take**
    - Create attempt, call resetAttempt, assert attempt and gradeItem are deleted; then call startAttempt, assert a new in_progress attempt is created
    - **Validates: Requirements 7.1, 7.2, 7.6**

- [x] 10. Implement quiz reset UI for teachers (frontend)
  - In `frontend/utils/api/extraApis.ts`, add `resetAttempt: (quizId: string, studentId: string) => api.delete(`/api/v1/quizzes/${quizId}/attempts/${studentId}`)`
  - In `page.tsx` teacher submissions list, add a "Reset" button per attempt row that calls `quizApi.resetAttempt(quizId, studentId)` then invalidates the quiz query
  - _Requirements: 7.3, 7.6_

- [x] 11. Implement auto-save to localStorage
  - In `ImmersiveQuizPlayer.tsx`, add a `useEffect` on `answers` that uses `setTimeout` (30 000 ms) to write `localStorage.setItem(`quiz-draft-${attempt._id}`, JSON.stringify(answers))`; clear the timeout on cleanup
  - Add an initializer inside the component that calls `localStorage.getItem(`quiz-draft-${attempt._id}`)` and, if found, passes the parsed value as the initial state of `answers` via `useState`
  - In `handleFinalSubmit`, after `await onSubmit(answers)` succeeds, call `localStorage.removeItem(`quiz-draft-${attempt._id}`)`
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 11.1 Write property test for localStorage draft round-trip
    - **Property 6: LocalStorage draft round-trip**
    - Generate random answer objects; serialize and deserialize via JSON; assert deep equality
    - Test that the component restores saved answers on mount
    - Test that localStorage entry is removed after successful submit
    - **Validates: Requirements 8.2, 8.4**

- [x] 12. Implement short-answer grading UI for teachers
  - In `page.tsx`, add a `gradingAttempt` state holding the currently-selected attempt for grading (or null)
  - In the teacher submissions list, add a "Grade" button on rows where `attempt.status === 'submitted'`; clicking sets `gradingAttempt`
  - Render an inline grading panel below the submissions list when `gradingAttempt` is set:
    - Display all quiz questions and the student's answers from `gradingAttempt.answers`
    - A number input for `scoreAdjustment` (required, numeric)
    - A textarea for `feedback` (optional)
    - A "Submit Grade" button that calls `quizApi.gradeAttempt(gradingAttempt._id, { scoreAdjustment, feedback })`, updates the attempt row in `allAttempts` state, and clears `gradingAttempt`
    - Client-side validation: if `scoreAdjustment` is empty or non-numeric, show an inline error and block the API call
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 12.1 Write unit tests for grading UI
    - Test that "Grade" button only appears for submitted attempts
    - Test that invalid scoreAdjustment shows validation error
    - Test that successful grade call updates the attempt status in UI
    - **Validates: Requirements 9.3, 9.4, 9.5**

- [x] 13. Restrict question access for unpublished quizzes
  - In `backend/src/controllers/questionController.js`, in `getQuestions`, fetch the quiz first; if `!quiz.isPublished && req.user.role === 'student'`, return 403 with message "This quiz has not been published yet"
  - Teachers and admins bypass the check and always receive questions
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 13.1 Write property test for question access control
    - **Property 7: Question access control by publish status**
    - Generate combinations of (isPublished: true/false) × (role: student/teacher/admin); assert 403 iff student + unpublished, 200 otherwise
    - **Validates: Requirements 10.1, 10.2, 10.3**

- [x] 14. Final checkpoint — ensure all tests pass
  - Ensure all tests pass; ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster delivery
- Each task references specific requirements for traceability
- Bug fixes (Tasks 1–5) should be completed and verified before moving to improvements (Tasks 7–13)
- Property tests use **fast-check** (already available or installable via `npm install --save-dev fast-check`)
- Unit/component tests use **Jest + React Testing Library** (standard for the Next.js frontend)
