# Bug Fix Requirements: Module Title Input Drag Interference

## Introduction

This bug fix addresses an issue where typing into the module title input field unintentionally triggers drag operations. The root cause is that the drag handle's PointerSensor lacks an activation constraint and its event listeners propagate to sibling elements, causing pointer movements during text input to initiate drags.

## Glossary

- **PointerSensor**: The dnd-kit sensor that detects pointer (mouse/touch) events to initiate drag operations
- **Activation Constraint**: A threshold (distance, delay, etc.) that must be met before a drag operation activates
- **GripVertical**: The visual drag handle component that users intentionally interact with to drag
- **Module Title Input**: The text input field where users enter the module name
- **Event Propagation**: The flow of events through the DOM tree to parent/sibling elements
- **Event Bubbling**: Uncontrolled propagation of pointer events from child to parent elements
- **PointerDown**: The event fired when a pointer device (mouse/touch) is pressed down

## Requirements

### Requirement 1: Prevent Unintended Drag Activation on Input Interaction

**User Story:** As a module editor, I want to type into the module title input without triggering a drag operation, so that I can edit module names without accidentally moving modules.

#### Acceptance Criteria

1. WHEN a user presses the pointer down on the module title input field, THEN THE Module Title Input SHALL prevent the pointer event from bubbling to the drag sensor
2. WHEN a user types into the module title input field (pointer movements during text input), THEN THE PointerSensor SHALL require a minimum distance of 8 pixels before initiating a drag
3. WHEN a user clicks and immediately releases on the module title input, THEN THE Module SHALL remain in its current position and not move
4. WHEN a user performs a drag operation on the GripVertical handle with a distance greater than 8 pixels, THEN THE PointerSensor SHALL initiate the drag normally

### Requirement 2: Ensure Input Focus and Selection Work Correctly

**User Story:** As a module editor, I want the module title input to handle selection and text editing normally, so that I can work with module names as expected.

#### Acceptance Criteria

1. WHEN a user triple-clicks to select all text in the module title input, THEN THE text SHALL be selected without initiating a drag
2. WHEN a user drags to select text within the module title input, THEN THE text SHALL be selected and no module drag SHALL be initiated
3. WHEN the user clicks elsewhere after editing, THEN THE edited module title SHALL be preserved and the module SHALL remain at its original position

### Requirement 3: Preserve Drag Functionality on Intended Drag Handle

**User Story:** As a module editor, I want to drag modules by their handle to reorder them, so that I can organize modules effectively.

#### Acceptance Criteria

1. WHEN a user performs a drag of at least 8 pixels on the GripVertical handle, THEN THE drag operation SHALL activate normally
2. WHEN a user drags a module, THEN other module interactions (like editing titles) SHALL not be affected
3. WHEN a user releases a dragged module, THEN THE module SHALL be positioned at the drop location
