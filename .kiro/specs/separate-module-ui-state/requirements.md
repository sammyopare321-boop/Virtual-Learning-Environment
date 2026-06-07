# Requirements Document: Separate Module UI State

## Introduction

Currently, the Module data type mixes UI state (`isExpanded`) with domain data. This coupling causes performance issues (unnecessary callback re-runs), data leakage (UI state serialized to API payloads), and architectural confusion (UI concerns embedded in data models). This refactoring separates UI state management from the Module data structure, improving performance, reducing coupling, and establishing clear separation of concerns.

## Glossary

- **Module**: A data structure representing a question or content grouping in the builder
- **Module_ID**: The unique identifier of a Module (string)
- **Expanded_State**: Whether a particular Module is currently visually expanded in the UI
- **Expanded_State_Set**: A collection tracking which Module IDs are currently expanded
- **StructureBuilder**: React component responsible for rendering and managing the module structure
- **Module_Data**: The domain data contained in a Module (all properties except `isExpanded`)
- **UI_State**: State that concerns the rendering and interaction of the UI, not persisted data
- **Callback**: A function invoked when module data or state changes
- **Serialization**: Converting data to JSON or other formats for storage or transmission

## Requirements

### Requirement 1: Separate isExpanded from Module Data Structure

**User Story:** As a developer, I want the Module interface to contain only domain data, so that UI concerns are not mixed with data concerns.

#### Acceptance Criteria

1. THE Module interface SHALL NOT contain an `isExpanded` property
2. WHEN the Module interface is updated, THE property removal SHALL be reflected in all type definitions and imports
3. IF code attempts to access `module.isExpanded`, THE TypeScript compiler SHALL raise a type error
4. THE refactored Module interface SHALL retain all non-UI properties (id, label, children, etc.)

### Requirement 2: Track Expanded State Independently in Component State

**User Story:** As a developer, I want expanded state tracked separately from module data, so that UI state changes don't affect domain data or trigger unnecessary callbacks.

#### Acceptance Criteria

1. WHEN StructureBuilder mounts, THE component SHALL initialize a state variable tracking expanded Module IDs
2. THE expanded state SHALL be stored as a `Set<string>` to provide O(1) lookup performance
3. WHEN the component unmounts, THE expanded state SHALL be discarded (session-only scope)
4. IF the module list changes, THE expanded state tracking SHALL remain independent and not automatically update

### Requirement 3: Pass Expanded State via Props

**User Story:** As a developer, I want components to receive expanded state as props, so that they can render appropriately without accessing module data.

#### Acceptance Criteria

1. WHEN a Module is rendered, THE component SHALL receive an `isExpanded` prop determined by the StructureBuilder's expanded state
2. THE `isExpanded` prop value SHALL be derived from checking if the Module's ID exists in the expanded state Set
3. WHEN the expanded state Set changes, THE `isExpanded` prop SHALL update accordingly
4. THE component SHALL use the prop value for rendering, not any internal module data

### Requirement 4: Update Toggle Logic to Manage Expanded State Independently

**User Story:** As a developer, I want toggle logic to update only the expanded state, so that module data remains untouched and callbacks are not triggered unnecessarily.

#### Acceptance Criteria

1. WHEN a user toggles a Module's expanded state, THEN the StructureBuilder SHALL update only the expanded state Set
2. IF a Module is expanded, THEN adding it to the expanded state Set SHALL result in `expandedIds.has(module.id) === true`
3. IF a Module is collapsed, THEN removing it from the expanded state Set SHALL result in `expandedIds.has(module.id) === false`
4. WHEN the expanded state Set is updated, THE action SHALL NOT trigger callbacks that operate on module data
5. WHEN a Module's expanded state changes, THE action SHALL be isolated and not affect sibling or parent Modules

### Requirement 5: Ensure No UI State in Serialized Data

**User Story:** As a developer, I want to ensure that when module data is persisted or sent to APIs, UI state is not included, so that data payloads remain clean and focused on domain concerns.

#### Acceptance Criteria

1. WHEN module data is serialized for API transmission, THE serialized payload SHALL NOT contain any `isExpanded` property
2. WHEN module data is serialized for persistent storage, THE `isExpanded` property SHALL NOT be present in the output
3. IF a snapshot of module data is created, THE snapshot SHALL not include expanded state
4. WHEN module data is loaded from an API or storage, THE data SHALL be agnostic to any previously stored expanded state

### Requirement 6: Maintain Existing Functionality

**User Story:** As a user, I want the Module expansion/collapse feature to work exactly as before, so that the refactoring is transparent to end users.

#### Acceptance Criteria

1. WHEN a user clicks the expand button on a Module, THEN the Module SHALL expand as before
2. WHEN a user clicks the collapse button on a Module, THEN the Module SHALL collapse as before
3. WHEN navigating to a new page or reloading the component, THEN the expanded state SHALL reset (no persistence across sessions)
4. WHEN a Module is expanded and the page is refreshed, THEN the expanded state SHALL not persist
5. WHEN multiple Modules exist, THEN expanding one Module SHALL NOT affect other Modules' expanded states

## Notes

- The refactoring is purely internal; no user-facing behavior should change
- Expanded state is session-only; no persistence is required
- This separation enables future optimizations like memoization and callback deduplication
- All type safety must be maintained during the refactoring (no `any` types)
