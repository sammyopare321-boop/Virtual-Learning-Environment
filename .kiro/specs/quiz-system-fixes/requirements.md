# Requirements Document

## Introduction

This document specifies the requirements for fixing critical bugs in the Quiz System of the Virtual Learning Environment (VLE) and implementing a set of improvements to the student and teacher quiz experience.

The bugs addressed are: cascade delete of quiz data, auto-submit on timer expiry sending empty answers, overly strict submission validation, a grading API field name mismatch, and a crash in the quiz player when questions have not yet loaded. The improvements cover answer review for students, quiz reset by teachers, auto-saving in-progress answers, a short-answer grading UI, and an access control fix for unpublished quiz questions.

## Glossary

- **Quiz_System**: The collection of backend controllers, routes, validation middleware, and frontend components that manage quiz creation, question management, attempt lifecycle, and grading.
- **QuizAttempt**: A MongoDB document that records a single student's attempt at a quiz, including their answers, score, and status (`in_progress`, `submitted`, `graded`).
- **Question**: A MongoDB document belonging to a quiz, storing question text, type, options, correct answer, and marks.
- **ImmersiveQuizPlayer**: The full-screen Next.js/React component used by students to answer questions during an active attempt.
- **Auto-submit**: The mechanism that submits a student's attempt automatically when the countdown timer reaches zero.
- **submitQuizSchema**: The Joi validation schema applied to `POST /quizzes/:id/submit` that validates the `answers` array.
- **gradeAttempt API**: The frontend helper `quizApi.gradeAttempt` in `extraApis.ts` that sends a PATCH request to grade a short-answer attempt.
- **Teacher**: A user with role `teacher` or `admin` who owns the course containing the quiz.
- **Student**: A user with role `student` who takes quizzes.
- **LocalStorage_Cache**: Browser localStorage used to persist in-progress quiz answers as a fallback against tab crashes.

---

## Requirements

### Requirement 1: Cascade Delete of Quiz Data

**User Story:** As a teacher, I want deleting a quiz to also remove all associated questions and attempts, so that orphaned documents do not accumulate in the database.

#### Acceptance Criteria

1. WHEN a teacher deletes a quiz, THE Quiz_System SHALL delete all Question documents whose `quiz` field references the deleted quiz.
2. WHEN a teacher deletes a quiz, THE Quiz_System SHALL delete all QuizAttempt documents whose `quiz` field references the deleted quiz.
3. WHEN a teacher deletes a quiz, THE Quiz_System SHALL delete all GradeItem documents whose `sourceId` field references the deleted quiz.
4. IF the quiz does not exist, THEN THE Quiz_System SHALL return a 404 error without performing any delete operations.
5. WHEN cascade deletion succeeds, THE Quiz_System SHALL return a 200 response confirming the quiz was deleted.

---

### Requirement 2: Auto-Submit Sends Valid Answers

**User Story:** As a student, I want the quiz to be submitted automatically when the timer runs out, so that my answered questions are recorded even if I did not manually submit.

#### Acceptance Criteria

1. WHEN the countdown timer reaches zero, THE ImmersiveQuizPlayer SHALL collect the current in-memory `answers` state and pass it to the submit handler instead of an empty object.
2. WHEN the countdown timer reaches zero and the student has answered zero questions, THE Quiz_System SHALL accept the submission and record a zero-score attempt.
3. WHEN the countdown timer reaches zero, THE Quiz_System SHALL transition the attempt status from `in_progress` to either `submitted` or `graded`.
4. WHILE an auto-submit is in progress, THE ImmersiveQuizPlayer SHALL prevent duplicate submit calls from being triggered.

---

### Requirement 3: Allow All-Skipped Submissions

**User Story:** As a student, I want to be able to submit a quiz even if I skipped all questions, so that my attempt is closed and I receive a recorded zero score rather than a stuck `in_progress` state.

#### Acceptance Criteria

1. THE submitQuizSchema SHALL accept an `answers` array with zero or more items.
2. WHEN a student submits with an empty answers array, THE Quiz_System SHALL record the attempt with a score of zero and status `graded` (assuming no short-answer questions).
3. IF the `answers` field is absent from the request body, THEN THE Quiz_System SHALL treat it as an empty array rather than returning a validation error.

---

### Requirement 4: Grading API Field Name Alignment

**User Story:** As a teacher, I want the grading action to work correctly end-to-end, so that score adjustments are applied without errors.

#### Acceptance Criteria

1. WHEN a teacher grades a short-answer attempt, THE gradeAttempt API helper SHALL send `{ scoreAdjustment, feedback }` in the request body.
2. THE backend `gradeAttempt` controller SHALL receive `scoreAdjustment` and apply it as `attempt.score + scoreAdjustment`.
3. WHEN grading succeeds, THE Quiz_System SHALL return the updated attempt with the final computed score and `status: 'graded'`.

---

### Requirement 5: ImmersiveQuizPlayer Question Load Guard

**User Story:** As a student, I want the quiz player to wait until questions are fully loaded before rendering, so that the player does not crash with a "Cannot read properties of undefined" error.

#### Acceptance Criteria

1. WHEN the ImmersiveQuizPlayer renders and the questions array is empty or not yet populated, THE ImmersiveQuizPlayer SHALL display a loading spinner instead of attempting to render question content.
2. WHEN questions are provided to ImmersiveQuizPlayer, THE Quiz_System SHALL ensure questions are fetched and set in state before the player component is rendered in the parent page.
3. IF questions fail to load after a start attempt, THEN THE Quiz_System SHALL display an error message and not render the ImmersiveQuizPlayer.

---

### Requirement 6: Answer Review for Students

**User Story:** As a student, I want to see which of my answers were correct or incorrect after my attempt is graded, so that I can learn from my mistakes.

#### Acceptance Criteria

1. WHEN a student views a graded attempt, THE Quiz_System SHALL display each question alongside the student's submitted answer and whether it was correct or incorrect.
2. WHEN a student views a graded attempt, THE Quiz_System SHALL display the student's total score and percentage.
3. WHEN a short-answer question is part of a graded attempt, THE Quiz_System SHALL display the student's response alongside any teacher feedback.
4. WHILE an attempt has status `submitted` (pending manual grading), THE Quiz_System SHALL display a message indicating that grading is in progress rather than showing per-question results.

---

### Requirement 7: Quiz Reset by Teacher

**User Story:** As a teacher, I want to delete a specific student's attempt so that the student can re-take the quiz.

#### Acceptance Criteria

1. WHEN a teacher requests to reset a student's attempt, THE Quiz_System SHALL delete the QuizAttempt document for that student and quiz.
2. WHEN a teacher requests to reset a student's attempt, THE Quiz_System SHALL delete the corresponding GradeItem document for that student and quiz.
3. WHEN a reset succeeds, THE Quiz_System SHALL return a 200 response confirming the attempt was deleted.
4. IF the attempt does not exist, THEN THE Quiz_System SHALL return a 404 error.
5. IF a user who is not a teacher or admin requests a reset, THEN THE Quiz_System SHALL return a 403 error.
6. WHEN a teacher resets an attempt, THE Quiz_System SHALL display the student as having no attempt in the teacher's submissions list.

---

### Requirement 8: Auto-Save Answers to LocalStorage

**User Story:** As a student, I want my in-progress answers to be periodically saved to localStorage, so that I do not lose all my work if my browser tab crashes or is accidentally closed.

#### Acceptance Criteria

1. WHILE a quiz attempt is `in_progress`, THE ImmersiveQuizPlayer SHALL save the current answers to LocalStorage_Cache at most every 30 seconds.
2. WHEN a student starts or resumes a quiz, THE ImmersiveQuizPlayer SHALL check LocalStorage_Cache for a saved draft for the same attempt ID and restore those answers if found.
3. WHEN a quiz attempt is successfully submitted, THE ImmersiveQuizPlayer SHALL remove the LocalStorage_Cache entry for that attempt.
4. THE LocalStorage_Cache entry SHALL be keyed by attempt ID to avoid collisions between different quizzes or students.

---

### Requirement 9: Short-Answer Grading UI for Teachers

**User Story:** As a teacher, I want a UI to review each student's short-answer responses and apply a score adjustment with feedback, so that I can complete grading for short-answer quizzes.

#### Acceptance Criteria

1. WHEN a teacher views an attempt with status `submitted`, THE Quiz_System SHALL display all questions and the student's answers for that attempt.
2. WHEN a teacher views a `submitted` attempt, THE Quiz_System SHALL provide an input for `scoreAdjustment` and an optional `feedback` text field.
3. WHEN a teacher submits the grading form, THE Quiz_System SHALL call the gradeAttempt API with `{ scoreAdjustment, feedback }` and update the attempt status to `graded`.
4. WHEN grading succeeds, THE Quiz_System SHALL update the displayed attempt status and score without requiring a full page reload.
5. IF the scoreAdjustment field is empty or non-numeric when the teacher submits, THEN THE Quiz_System SHALL display a validation error and prevent the API call.

---

### Requirement 10: Restrict Question Access for Unpublished Quizzes

**User Story:** As a teacher, I want students to be unable to fetch questions for unpublished quizzes, so that quiz content is not exposed before the quiz is released.

#### Acceptance Criteria

1. WHEN a student requests `GET /quizzes/:id/questions` for an unpublished quiz, THE Quiz_System SHALL return a 403 error with the message "This quiz has not been published yet".
2. WHEN a teacher or admin requests `GET /quizzes/:id/questions` for any quiz regardless of publish status, THE Quiz_System SHALL return the questions.
3. WHEN a student requests `GET /quizzes/:id/questions` for a published quiz, THE Quiz_System SHALL return the questions normally.
4. IF the quiz does not exist, THEN THE Quiz_System SHALL return a 404 error for any user role.
