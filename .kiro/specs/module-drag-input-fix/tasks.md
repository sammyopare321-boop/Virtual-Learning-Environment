# Implementation Plan: Module Title Input Drag Interference Fix

## Overview

This implementation plan fixes the bug where typing into the module title input unintentionally triggers drag operations. The fix involves configuring the PointerSensor with an 8-pixel activation constraint and adding event propagation stoppage on the input element. We'll implement these changes incrementally, with testing at each step to ensure correct behavior and no regression of drag functionality.

## Tasks

- [ ] 1. Configure PointerSensor with activation constraint
  - Locate the drag sensor configuration for module dragging
  - Add `activationConstraint: { distance: 8 }` to the PointerSensor configuration
  - Verify the configuration is passed correctly to dnd-kit
  - _Requirements: 1.2, 1.4, 3.1_

- [ ]* 1.1 Write property test for small movements not triggering drag
  - **Property 1: Small Pointer Movements Do Not Trigger Drag**
  - **Validates: Requirements 1.2**
  - Generate random pointer move sequences with cumulative distance < 8px on the input
  - Verify that drag is not initiated for any sequence
  - Run property test with minimum 100 iterations

- [ ] 2. Add event propagation stoppage to module title input
  - Locate the module title input component
  - Add a `onPointerDown` handler that calls `event.stopPropagation()`
  - Ensure the handler is attached to the input element, not a parent
  - Test that the handler doesn't interfere with input focus or selection
  - _Requirements: 1.1, 1.3_

- [ ]* 2.1 Write unit tests for input pointer event handling
  - Test that pointer-down on input stops propagation
  - Test that pointer-down on input does not initiate drag
  - Test that input maintains focus after pointer interactions
  - _Requirements: 1.1, 1.3_

- [ ]* 2.2 Write property test for input event isolation
  - **Property 4: Pointer Events on Input Element Are Isolated**
  - **Validates: Requirements 1.3, 2.1**
  - Generate random pointer sequences on the input (including > 8px movements)
  - Verify that module position does not change for any sequence
  - Run property test with minimum 100 iterations

- [ ] 3. Verify drag still works on the GripVertical handle
  - Test dragging the GripVertical handle with movements >= 8 pixels
  - Verify that drag operations initiate and complete normally
  - Verify that module position changes correctly when dragged
  - _Requirements: 1.4, 3.1, 3.3_

- [ ]* 3.1 Write property test for sufficient drag distance activation
  - **Property 3: Sufficient Drag Distance Activates Drag on Handle**
  - **Validates: Requirements 1.4, 3.1**
  - Generate random pointer sequences on handle with movement >= 8px
  - Verify that drag is initiated for all such sequences
  - Run property test with minimum 100 iterations

- [ ]* 3.2 Write unit tests for drag handle behavior
  - Test that clicking handle without movement doesn't initiate drag
  - Test that dragging handle with sufficient distance works correctly
  - Test that rapid clicks on handle work as expected
  - _Requirements: 1.4, 3.1_

- [ ] 4. Test text selection scenarios
  - Test triple-click to select all text in the input
  - Test click-and-drag within the input to select text range
  - Verify that text selection completes without triggering module drag
  - Verify that selected text is highlighted correctly
  - _Requirements: 2.1, 2.2_

- [ ]* 4.1 Write unit tests for text selection behavior
  - Test triple-click selection without drag initiation
  - Test range-select behavior without drag initiation
  - Test that focus remains on input after selection
  - _Requirements: 2.1, 2.2_

- [ ]* 4.2 Write property test for text selection isolation
  - **Property 5: Text Selection Within Input Does Not Trigger Module Drag**
  - **Validates: Requirements 2.2**
  - Generate various text selection patterns (triple-click, range select)
  - Verify that drag is not initiated for any selection pattern
  - Run property test with minimum 100 iterations

- [ ] 5. Test input value preservation
  - Edit the module title in the input
  - Click elsewhere to blur the input
  - Verify that the edited value is preserved
  - Verify that the module remains at its original position
  - _Requirements: 2.3_

- [ ]* 5.1 Write unit tests for input value and position preservation
  - Test that edited input value persists after blur
  - Test that module position doesn't change during input editing
  - Test that value is correctly synced to the module data
  - _Requirements: 2.3_

- [ ] 6. Test edge cases and touch device behavior
  - Test with very long module titles that expand the input width
  - Test with special characters in the input
  - Test on touch devices (or touch event simulation)
  - Verify 8-pixel constraint works with various pointer speeds
  - _Requirements: 1.2, 1.3_

- [ ]* 6.1 Write unit tests for edge cases
  - Test with very long module titles
  - Test with special characters
  - Test with disabled input
  - Test pointer behavior with rapid movements
  - _Requirements: 1.2, 1.3_

- [ ] 7. Checkpoint - Verify all core fixes are working
  - Run the application and manually test the main scenarios:
    - Type into module title without triggering drag
    - Drag module by handle to reorder
    - Select text in title without triggering drag
  - Ensure no console errors or warnings
  - Ask the user if questions arise

- [ ] 8. Run full test suite
  - Execute all unit tests
  - Execute all property-based tests
  - Verify all tests pass with no failures
  - Ensure code coverage is adequate for the changes

- [ ] 9. Final checkpoint - Regression testing
  - Verify that existing drag functionality still works correctly
  - Verify that other module interactions are unaffected
  - Test module reordering with multiple modules
  - Test interaction between multiple modules with the fix applied
  - Ensure no performance degradation
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The 8-pixel activation constraint is calibrated to allow normal text input without triggering drag
- Event propagation stoppage provides defense-in-depth alongside the activation constraint
- All property tests should run with minimum 100 iterations to ensure robustness
- The fix maintains backward compatibility with existing drag behavior
