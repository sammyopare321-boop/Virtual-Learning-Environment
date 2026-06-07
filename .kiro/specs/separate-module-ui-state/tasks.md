# Implementation Plan: Separate Module UI State

## Overview

This refactoring separates UI state (`isExpanded`) from the Module data type. The StructureBuilder component currently stores expanded state in each Module object, causing performance issues and data leakage. We'll move this to a separate `expandedIds` Set maintained at the component level, then pass `isExpanded` as a computed prop to child components.

Implementation order ensures incremental validation: type changes first, then state management, then component updates, then testing.

## Tasks

- [ ] 1. Update Module Interface and Remove isExpanded Property
  - Update the Module interface in StructureBuilder.tsx to remove the `isExpanded?: boolean` property
  - Verify TypeScript compilation catches any remaining references to `module.isExpanded`
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Add Expanded State Management to StructureBuilder Component
  - Add `const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())` state to StructureBuilder
  - Create a `handleToggle(moduleId: string)` function that adds/removes the ID from expandedIds
  - Replace the existing toggle logic that mutates module.isExpanded
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 3. Update SortableModule Component Props
  - Add `isExpanded: boolean` prop to SortableModule component interface
  - Remove all references to `module.isExpanded` within SortableModule
  - Use the `isExpanded` prop throughout the component instead
  - Update all conditional rendering that depends on expanded state to use the prop
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 4. Pass isExpanded Prop from StructureBuilder
  - Update StructureBuilder's SortableModule rendering to pass `isExpanded={expandedIds.has(module.id)}`
  - Update the onToggle callback to call `handleToggle(module.id)`
  - Verify the expanded state computation is correct (new Set spread pattern to avoid mutation)
  - _Requirements: 3.4, 4.1_

- [ ] 5. Update addModule Function to Remove isExpanded
  - Modify the addModule function to create new modules without `isExpanded` property
  - New modules should not have any isExpanded initialization
  - _Requirements: 1.1, 2.3_

- [ ] 6. Verify No UI State in Initial Data
  - Review the initial modules array in StructureBuilder to remove any `isExpanded: true` initialization
  - Set expandedIds to an empty Set initially (session-only)
  - Add comment explaining that expanded state is session-only and reset on component unmount
  - _Requirements: 2.3, 2.4, 5.2_

- [ ] 7. Checkpoint - Verify TypeScript Compilation and Basic Functionality
  - Ensure TypeScript compilation succeeds with no errors
  - Verify the application runs without runtime errors
  - Test that modules can be expanded and collapsed correctly
  - Confirm expanded state persists only during the session (resets on unmount)
  - Ask the user if they encounter any issues before proceeding to testing

- [ ] 8. Write Property Test for Module Interface Type Safety
  - Create property test verifying Module interface has no `isExpanded` property
  - Use TypeScript's type system to verify this constraint
  - Test that any code attempting `module.isExpanded` fails type checking
  - **Property 1: No isExpanded in Module Data**
  - **Validates: Requirements 1.2, 1.3**
  - _Mark as optional with *_

- [ ] 9. Write Property Test for Toggle Idempotence
  - Generate random module IDs and test toggling each twice
  - Verify toggling the same ID twice returns it to original state
  - Generate 100+ random scenarios covering both initially-expanded and initially-collapsed cases
  - **Property 2: Expanded State Idempotence**
  - **Validates: Requirements 4.2, 4.3**
  - _Mark as optional with *_

- [ ] 10. Write Property Test for Toggle Isolation
  - Generate random sets of module IDs and toggle one
  - Verify only the toggled ID changes state, all others remain unchanged
  - Test various combinations of module count and toggle sequences
  - **Property 3: Toggle Isolation**
  - **Validates: Requirements 4.5**
  - _Mark as optional with *_

- [ ] 11. Write Property Test for Serialization Exclusion
  - Generate random Module objects and serialize via JSON.stringify
  - Verify the output string does NOT contain `"isExpanded"`
  - Test with various module structures (children, nested items, etc.)
  - **Property 4: Serialization Exclusion**
  - **Validates: Requirements 5.1, 5.2, 5.3**
  - _Mark as optional with *_

- [ ] 12. Write Property Test for Prop-Driven Rendering
  - Generate random Module objects and isExpanded prop values
  - Render SortableModule with the prop and verify visual state matches prop
  - Test that rendered output changes when prop value changes
  - **Property 5: Prop-Driven Rendering**
  - **Validates: Requirements 3.3, 3.4, 6.1, 6.2**
  - _Mark as optional with *_

- [ ] 13. Write Property Test for State Reset on Unmount
  - Mount and unmount StructureBuilder multiple times
  - Verify each new instance starts with empty expandedIds
  - Generate random toggle sequences and verify they don't persist across mounts
  - **Property 6: State Reset on Unmount**
  - **Validates: Requirement 2.4**
  - _Mark as optional with *_

- [ ] 14. Write Unit Tests for Toggle Behavior
  - Test toggling a single module: verify it enters expandedIds
  - Test toggling the same module again: verify it's removed from expandedIds
  - Test toggling multiple different modules: verify each toggles independently
  - Test rendering with empty expandedIds: verify all modules appear collapsed
  - Test rendering with all IDs in expandedIds: verify all modules appear expanded
  - _Mark as optional with *_

- [ ] 15. Write Unit Tests for Edge Cases
  - Empty module list: verify no errors
  - Module with no children: verify toggle works
  - Module with deeply nested children: verify toggle works
  - Rapid successive toggles of same module: verify state stabilizes correctly
  - Component re-render with prop changes: verify UI updates correctly
  - _Mark as optional with *_

- [ ] 16. Write Unit Tests for Data Integrity
  - Add module to tree and verify no `isExpanded` property exists on module data
  - Update module properties (title, items) and verify expanded state is independent
  - Serialize module data and verify JSON output has no isExpanded field
  - Verify module mutations (adding/removing items) don't trigger state changes
  - _Mark as optional with *_

- [ ] 17. Final Checkpoint - Ensure All Tests Pass
  - Run all property tests and verify they pass with 100+ iterations each
  - Run all unit tests and verify they pass
  - Verify TypeScript compilation with no errors
  - Verify no console warnings or errors in browser devtools
  - Ask the user if questions arise
