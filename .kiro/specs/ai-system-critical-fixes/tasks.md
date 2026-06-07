# Implementation Plan: AI System Critical Fixes

## Overview

This implementation plan addresses four critical issues in sequential order: (1) fixing the broken risk prediction imports, (2) implementing rate limiting across all AI endpoints, (3) adding input validation, and (4) preventing prompt injection through input sanitization. Each section builds incrementally with checkpoints to ensure stability.

## Tasks

- [x] 1. Fix Risk Prediction System Imports and Error Handling
  - [x] 1.1 Update import statement in riskPrediction.js
    - Change import from `./aiHelper` to `./aiClient`
    - Import `createCompletion` and `parseJSON` functions
    - _Requirements: 1.1_
  
  - [x] 1.2 Refactor predictStudentRisk function to use createCompletion
    - Replace `getClient().chat.completions.create()` with `createCompletion()`
    - Update function to pass messages array, maxTokens, and temperature as separate parameters
    - Add comprehensive error handling with fallback return structure
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [x] 1.3 Refactor generateInterventionPlan function to use createCompletion
    - Replace `getClient().chat.completions.create()` with `createCompletion()`
    - Add comprehensive error handling with fallback return structure
    - _Requirements: 1.2, 1.3, 1.5_
  
  - [x] 1.4 Refactor identifyAtRiskStudents function to use createCompletion
    - Replace `getClient().chat.completions.create()` with `createCompletion()`
    - Add comprehensive error handling with fallback return structure
    - _Requirements: 1.2, 1.3, 1.6_
  
  - [x] 1.5 Refactor trackInterventionProgress function to use createCompletion
    - Replace `getClient().chat.completions.create()` with `createCompletion()`
    - Add comprehensive error handling with fallback return structure
    - _Requirements: 1.2, 1.3, 1.7_
  
  - [x] 1.6 Refactor generateRiskReport function to use createCompletion
    - Replace `getClient().chat.completions.create()` with `createCompletion()`
    - Add comprehensive error handling with fallback return structure
    - _Requirements: 1.2, 1.3, 1.8_
  
  - [ ]* 1.7 Write property test for risk prediction execution without TypeError
    - **Property 1: Risk Prediction Functions Execute Without TypeError**
    - **Validates: Requirements 1.2**
  
  - [ ]* 1.8 Write property test for AI error handling
    - **Property 2: AI Errors Return Structured Responses**
    - **Validates: Requirements 1.3, 5.2**
  
  - [x]* 1.9 Write unit tests for each risk prediction function
    - Test successful execution with valid inputs
    - Test error handling with mock AI client failures
    - Test fallback data structure correctness
    - _Requirements: 1.2, 1.3, 5.1_

- [x] 2. Checkpoint - Verify risk prediction system is functional
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Implement Rate Limiting Infrastructure
  - [x] 3.1 Create rate limiter factory functions in aiRoutes.js
    - Import express-rate-limit
    - Create restrictiveLimiter (3 req/15min)
    - Create conservativeLimiter (5 req/15min)
    - Create standardLimiter (10 req/15min)
    - Create moderateLimiter (15 req/15min)
    - Create generousLimiter (20 req/15min)
    - Create veryGenerousLimiter (30 req/15min)
    - Configure keyGenerator to use req.user?.id || req.ip
    - Configure standardHeaders: true and legacyHeaders: false
    - Add custom handler that returns 429 with retryAfter in response body
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 3.2 Apply rate limiters to all AI endpoints
    - Apply restrictiveLimiter to: `/create-course`, `/grade-batch`
    - Apply conservativeLimiter to: `/course-outline`, `/syllabus`
    - Apply standardLimiter to: `/quiz-questions`, `/assignment-prompt`, `/lecture-notes`, `/generate-rubric`, `/learning-path`, `/at-risk-students`
    - Apply moderateLimiter to: `/practice-problems`, `/intervention`
    - Apply generousLimiter to: `/student-feedback`, `/explain-concept`, `/analyze-answer`, `/check-plagiarism`
    - Apply veryGenerousLimiter to: `/tutoring`, `/grade-submission`, `/search`, `/search/suggestions`
    - Insert rate limiter middleware after auth middleware and before handler
    - _Requirements: 2.5-2.24_
  
  - [ ]* 3.3 Write property test for rate limit enforcement
    - **Property 3: Rate Limit Violations Return 429**
    - **Validates: Requirements 2.1**
  
  - [ ]* 3.4 Write property test for Retry-After header presence
    - **Property 4: Rate Limit Response Includes Retry-After Header**
    - **Validates: Requirements 2.2**
  
  - [ ]* 3.5 Write property test for rate limit error messages
    - **Property 5: Rate Limit Response Includes Error Message**
    - **Validates: Requirements 2.3**
  
  - [ ]* 3.6 Write property test for per-user rate limiting
    - **Property 6: Rate Limits Are Per-User Not Per-IP**
    - **Validates: Requirements 2.4**
  
  - [ ]* 3.7 Write unit tests for rate limiter configuration
    - Test each rate limiter tier configuration
    - Test rate limit response format
    - Test rate limit logging
    - _Requirements: 2.1, 2.2, 2.3, 5.3_

- [x] 4. Checkpoint - Verify rate limiting is working correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Input Validation
  - [x] 5.1 Create validateQuizRequest middleware function
    - Validate topic is a non-empty string
    - Validate count is an integer between 1 and 20 (default to 5 if omitted)
    - Validate difficulty is one of: 'easy', 'medium', 'hard'
    - Return 400 with clear error messages for validation failures
    - Add validation failure logging
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 5.4_
  
  - [x] 5.2 Apply validateQuizRequest middleware to /quiz-questions endpoint
    - Insert after auth and rate limiter, before handler
    - _Requirements: 3.1-3.6_
  
  - [ ]* 5.3 Write property test for invalid count rejection
    - **Property 7: Invalid Count Values Are Rejected**
    - **Validates: Requirements 3.1, 3.5**
  
  - [ ]* 5.4 Write property test for validation error messages
    - **Property 8: Validation Errors Include Helpful Messages**
    - **Validates: Requirements 3.6**
  
  - [ ]* 5.5 Write unit tests for edge cases
    - Test count = 0 (reject)
    - Test count = 1 (accept)
    - Test count = 20 (accept)
    - Test count = 21 (reject)
    - Test omitted count (default to 5)
    - Test non-integer count (reject)
    - Test invalid difficulty (reject)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [-] 6. Implement Prompt Injection Prevention
  - [x] 6.1 Create sanitizeInput function in aiClient.js
    - Accept input string and optional maxLength parameter (default 5000)
    - Truncate input to maxLength characters
    - Define array of suspicious patterns (regex for common injection attempts)
    - Replace matched patterns with filtered placeholders
    - Log security warnings when patterns are detected
    - Normalize excessive whitespace
    - Export sanitizeInput function
    - _Requirements: 4.1, 4.2, 5.5_
  
  - [x] 6.2 Update aiHelper.js functions to sanitize inputs
    - Import sanitizeInput from aiClient
    - Apply sanitization to topic parameter in generateCourseOutline
    - Apply sanitization to topic parameter in generateQuizQuestions
    - Apply sanitization to topic parameter in generateAssignmentPrompt
    - Apply sanitization to topic parameter in generateLectureNotes
    - _Requirements: 4.4, 4.5, 4.6, 4.7_
  
  - [ ] 6.3 Update aiTutoring.js functions to sanitize inputs
    - Import sanitizeInput from aiClient
    - Apply sanitization to question and concept parameters
    - Apply sanitization to studentAnswer parameter
    - _Requirements: 4.9, 4.10_
  
  - [ ] 6.4 Update aiGrading.js functions to sanitize inputs
    - Import sanitizeInput from aiClient
    - Apply sanitization to submissionContent parameter
    - _Requirements: 4.11_
  
  - [ ] 6.5 Update aiSearch.js functions to sanitize inputs
    - Import sanitizeInput from aiClient
    - Apply sanitization to query parameter
    - _Requirements: 4.12_
  
  - [ ]* 6.6 Write property test for dangerous pattern sanitization
    - **Property 9: Dangerous Prompt Patterns Are Sanitized**
    - **Validates: Requirements 4.1**
  
  - [ ]* 6.7 Write property test for input truncation
    - **Property 10: Long Inputs Are Truncated**
    - **Validates: Requirements 4.2**
  
  - [ ]* 6.8 Write property test for legitimate content preservation
    - **Property 11: Legitimate Content Is Preserved**
    - **Validates: Requirements 4.3, 6.4**
  
  - [ ]* 6.9 Write unit tests for specific prompt injection patterns
    - Test "ignore previous instructions" pattern
    - Test "you are now" pattern
    - Test "system prompt:" pattern
    - Test input at exactly 5000 characters
    - Test input at 5001 characters
    - Test benign inputs remain unchanged
    - Test security logging occurs for detected patterns
    - _Requirements: 4.1, 4.2, 4.3, 5.5_

- [ ] 7. Verify Backward Compatibility
  - [ ]* 7.1 Write property test for return value structure consistency
    - **Property 12: Return Value Structures Remain Consistent**
    - **Validates: Requirements 6.2**
  
  - [ ]* 7.2 Write property test for successful response format consistency
    - **Property 13: Successful Responses Maintain Format**
    - **Validates: Requirements 6.3**
  
  - [ ]* 7.3 Run existing unit tests to verify no regressions
    - Execute full test suite
    - Verify all pre-existing tests pass
    - _Requirements: 6.5_

- [ ] 8. Final Integration and Documentation
  - [ ] 8.1 Add comprehensive error logging throughout
    - Add structured logging for AI errors with context
    - Add security event logging for prompt injection detection
    - Add rate limit event logging
    - Add validation failure logging
    - _Requirements: 5.1, 5.3, 5.4, 5.5_
  
  - [ ]* 8.2 Write integration tests for critical paths
    - Test end-to-end risk prediction flow
    - Test end-to-end quiz generation with rate limiting and validation
    - Test end-to-end grading with sanitization
    - _Requirements: 1.2, 1.3, 2.1, 3.1, 4.1_
  
  - [ ] 8.3 Update error handling documentation
    - Document all error response formats
    - Document rate limit configurations
    - Document validation rules
    - Document sanitization behavior
    - _Requirements: All_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after major sections
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- The implementation follows a logical sequence: fix broken code → add protection layers → verify compatibility
