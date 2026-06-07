# Design Document: Module Title Input Drag Interference Fix

## Overview

This design addresses the bug where typing into the module title input field unintentionally triggers drag operations. The solution involves two complementary changes:

1. Adding an activation constraint to the PointerSensor to require minimum distance (8 pixels) before initiating drag
2. Implementing event propagation stoppage on the input element to prevent pointer events from bubbling to the drag handler

This ensures that normal text input interactions are not interrupted by drag detection, while preserving intentional drag functionality on the drag handle.

## Architecture

The fix operates at two levels of the event handling hierarchy:

```
Module Container (with drag listener)
├── GripVertical Handle (drag handle)
│   └── Event listeners (pointer, move, etc.)
└── Module Title Input (text input)
    └── PointerDown handler (stops propagation)
```

The PointerSensor continuously monitors pointer events at the container level. Without constraints, any pointer movement triggers a drag attempt. By combining distance-based constraints with event stoppage at the input level, we create a dual-layer prevention system:

- **Layer 1 (Input Level)**: Stop propagation on pointer-down to prevent event bubbling from the input
- **Layer 2 (Sensor Level)**: Require 8-pixel minimum distance before drag activation, protecting against small movements during text input

## Components and Interfaces

### PointerSensor Configuration

The PointerSensor needs to be configured with an activation constraint:

```typescript
interface ActivationConstraint {
  distance?: number;  // Minimum distance in pixels before drag activates
  delay?: number;     // Minimum time in milliseconds before drag activates
  tolerance?: number; // Tolerance in pixels for activation constraint
}
```

The sensor will be configured as:
```typescript
activationConstraint: {
  distance: 8
}
```

### Module Title Input Handler

The module title input requires a pointer event handler to stop event propagation:

```typescript
interface PointerEventHandler {
  (event: PointerEvent): void;
}

// Handler implementation:
const handleInputPointerDown = (event: PointerEvent) => {
  event.stopPropagation();
};
```

## Data Models

No new data models are required. This fix operates entirely on event handling and configuration.

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Small Pointer Movements Do Not Trigger Drag

*For any* pointer event sequence starting on the module title input with cumulative movement less than 8 pixels, the drag operation SHALL NOT be initiated, regardless of pointer event frequency or timing.

**Validates: Requirements 1.2**

### Property 2: Input Events Stop Propagation

*For any* pointer-down event on the module title input element, the event's propagation SHALL be stopped before reaching the parent drag handler, ensuring drag listeners do not receive the event.

**Validates: Requirements 1.1**

### Property 3: Sufficient Drag Distance Activates Drag on Handle

*For any* pointer event sequence on the GripVertical handle with cumulative movement of 8 pixels or greater, the drag operation SHALL be initiated normally.

**Validates: Requirements 1.4, 3.1**

### Property 4: Pointer Events on Input Element Are Isolated

*For any* pointer interaction (down, move, up) on the module title input element, the module SHALL remain at its original position and not move, even if the pointer sequence exceeds 8 pixels of movement.

**Validates: Requirements 1.3, 2.1**

### Property 5: Text Selection Within Input Does Not Trigger Module Drag

*For any* text selection operation within the module title input (including triple-click or drag-to-select), the selection SHALL complete without initiating a module drag operation.

**Validates: Requirements 2.2**

## Error Handling

### Pointer Event Handling Edge Cases

- **Touch devices**: The pointer sensor should work identically on touch and mouse events, with the 8-pixel constraint applying to all pointer types
- **Multi-touch**: Only the primary pointer should trigger drag; secondary pointers should be ignored
- **Event interception**: If the input element loses focus during a drag attempt, the drag should continue normally on the handle

### Activation Constraint Behavior

- The 8-pixel distance is measured as cumulative movement, not just the final position delta
- The constraint resets on each new pointer-down event
- Simultaneous pointer events from multiple pointers should each be evaluated independently

## Testing Strategy

### Unit Tests

Unit tests validate specific scenarios and edge cases:

1. **Input Element Behavior**
   - Verify that clicking on the input does not initiate drag
   - Verify that pointer-down on input stops event propagation
   - Verify that input maintains focus after pointer interactions
   - Verify that input value is preserved after interactions

2. **Drag Handle Behavior**
   - Verify that clicking on the drag handle without movement does not initiate drag
   - Verify that text interactions on the handle (if any) don't conflict
   - Verify that rapid clicks on the handle work correctly

3. **Edge Cases**
   - Verify behavior with very long module titles that push the input width
   - Verify behavior when the input is disabled
   - Verify behavior with special characters in the input
   - Verify behavior on touch devices with various pointer speeds

### Property-Based Tests

Property-based tests validate universal correctness properties across many generated inputs:

1. **Property 1: Small Pointer Movements Do Not Trigger Drag**
   - Generate random pointer move sequences on the input with cumulative distance < 8px
   - Verify that no drag is initiated for any such sequence
   - Test multiple pointer event sequences to ensure consistency

2. **Property 2: Input Events Stop Propagation**
   - Generate pointer-down events on the input
   - Verify that each event has its propagation stopped
   - Verify that parent handlers do not receive the event

3. **Property 3: Sufficient Drag Distance Activates Drag on Handle**
   - Generate random pointer sequences with movement >= 8px on the handle
   - Verify that drag is initiated for all such sequences
   - Verify that drag initiates consistently regardless of movement speed

4. **Property 4: Pointer Events on Input Element Are Isolated**
   - Generate random pointer sequences (including those > 8px) on the input
   - Verify that module position does not change
   - Verify that no drag state changes occur

5. **Property 5: Text Selection Within Input Does Not Trigger Module Drag**
   - Generate various text selection patterns (triple-click, range select, etc.)
   - Verify that selection completes without drag initiation
   - Verify that selected text is highlighted correctly

### Test Configuration

- Minimum 100 iterations per property test
- Mock the dnd-kit PointerSensor to intercept drag activation attempts
- Mock pointer events with synthetic PointerEvent objects
- Use fixture data with various input sizes and module configurations
