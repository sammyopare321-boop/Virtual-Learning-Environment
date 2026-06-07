# Design Document: Separate Module UI State

## Overview

This refactoring separates UI state management (`isExpanded`) from the Module data type. Currently, `isExpanded` is a property on the Module interface, which causes three problems:

1. **Performance**: Toggling `isExpanded` mutates the module object, triggering all callbacks that operate on modules
2. **Data Leakage**: Serialized module data includes `isExpanded`, polluting API payloads and persistent storage
3. **Architectural Coupling**: UI concerns are mixed with domain data, making the codebase harder to reason about

The solution moves expanded state tracking to the component level using React's `useState` hook with a `Set<string>` for O(1) lookups. Components receive `isExpanded` as a computed prop instead of accessing it from module data.

### Benefits

- **Improved Performance**: Toggling expanded state doesn't mutate module data, avoiding unnecessary callback reruns
- **Clean Data**: Module serialization remains free of UI concerns
- **Better Separation**: Clear distinction between data and presentation logic
- **Future-Proof**: Enables memoization and callback optimization strategies

## Architecture

### Component Hierarchy

```
StructureBuilder (state owner)
├── Manages expanded state: Set<string>
├── Computes isExpanded props
└── Passes to child components
    └── ModuleComponent (receives isExpanded prop)
        ├── Renders module content
        └── Calls onToggle callback
```

### State Flow

1. **StructureBuilder** initializes `expandedIds` state as an empty `Set<string>`
2. **Child components** receive `isExpanded={expandedIds.has(module.id)}` prop
3. **On toggle**, child calls `onToggle(moduleId)` callback
4. **StructureBuilder** updates `expandedIds` Set: add if collapsed, remove if expanded
5. **React re-renders** with updated props, children reflect new state

## Components and Interfaces

### Before Refactoring

```typescript
interface Module {
  id: string;
  label: string;
  children?: Module[];
  isExpanded?: boolean; // ❌ UI state mixed with data
}

interface ModuleComponentProps {
  module: Module;
  onToggle: (moduleId: string) => void;
}
```

### After Refactoring

```typescript
interface Module {
  id: string;
  label: string;
  children?: Module[];
  // ✅ isExpanded removed
}

interface ModuleComponentProps {
  module: Module;
  isExpanded: boolean; // ✅ Passed as explicit prop
  onToggle: (moduleId: string) => void;
}
```

### StructureBuilder Component

**State Management:**
```typescript
const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

const handleToggle = (moduleId: string) => {
  setExpandedIds(prev => {
    const newSet = new Set(prev);
    if (newSet.has(moduleId)) {
      newSet.delete(moduleId);
    } else {
      newSet.add(moduleId);
    }
    return newSet;
  });
};
```

**Rendering:**
```typescript
<ModuleComponent
  module={module}
  isExpanded={expandedIds.has(module.id)}
  onToggle={handleToggle}
/>
```

## Data Models

### Module Interface (Updated)

**Old:**
```typescript
interface Module {
  id: string;
  label: string;
  children?: Module[];
  isExpanded?: boolean;
}
```

**New:**
```typescript
interface Module {
  id: string;
  label: string;
  children?: Module[];
}
```

### Component Props (Updated)

All components that previously accessed `module.isExpanded` now receive it as a prop:

```typescript
interface ExpandableModuleProps {
  module: Module;
  isExpanded: boolean;
  onToggle: (moduleId: string) => void;
  children?: React.ReactNode;
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: No isExpanded in Module Data

**For any** Module object in the system, after refactoring, accessing `module.isExpanded` SHALL result in `undefined`, and TypeScript SHALL flag this as a type error if the code compiles.

**Validates: Requirements 1.2, 1.3**

### Property 2: Expanded State Idempotence

**For any** Module ID, toggling its expanded state twice SHALL return it to its original state. If the ID was initially in `expandedIds`, toggling twice leaves it in `expandedIds`; if initially absent, it remains absent.

**Validates: Requirements 4.2, 4.3**

### Property 3: Toggle Isolation

**For any** set of Modules and any Module ID being toggled, toggling SHALL only affect that Module's presence in `expandedIds`. All other Module IDs in the set SHALL retain their expanded state unchanged.

**Validates: Requirements 4.5**

### Property 4: Serialization Exclusion

**For any** Module object serialized to JSON via `JSON.stringify()`, the resulting string SHALL NOT contain the substring `"isExpanded"`.

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 5: Prop-Driven Rendering

**For any** Module component rendered with `isExpanded` prop, the rendered output's visual state (expanded or collapsed) SHALL match the prop value, regardless of any internal module data.

**Validates: Requirement 3.3, 3.4, 6.1, 6.2**

### Property 6: State Reset on Unmount

**For any** StructureBuilder component instance, unmounting and remounting SHALL result in an empty `expandedIds` set on the new instance, regardless of the previous instance's state.

**Validates: Requirement 2.4**

## Error Handling

### Type Safety

- **Error**: Accessing `module.isExpanded` on refactored Module interface
- **Handling**: TypeScript compiler error prevents runtime failures
- **Recovery**: Update component to receive `isExpanded` as a prop instead

### Prop Mismatch

- **Error**: Component receives `isExpanded` prop but renders based on `module.isExpanded`
- **Handling**: Console warnings during development; visual rendering discrepancy in production
- **Recovery**: Ensure all components consistently use the prop, not module data

### State Synchronization

- **Error**: Expanded state Set becomes out of sync with rendered UI
- **Handling**: React DevTools inspection reveals inconsistency
- **Recovery**: Check that `handleToggle` is the only source of truth for Set mutations

## Testing Strategy

### Property-Based Testing

**Test Configuration:**
- Framework: `vitest` with `fast-check` for property-based testing
- Iterations: Minimum 100 per property test
- Tag format: `Feature: separate-module-ui-state, Property N: [property_text]`

**Property Test Mapping:**
- **Property 1**: Verify Module interface has no `isExpanded` via TypeScript type checking
- **Property 2**: Generate random Module IDs, toggle twice, verify idempotence
- **Property 3**: Generate random Module ID sets, toggle one ID, verify others unchanged
- **Property 4**: Generate random Module objects, serialize to JSON, verify no `isExpanded` substring
- **Property 5**: Generate random `isExpanded` values, verify rendered output matches prop
- **Property 6**: Mount and unmount StructureBuilder, verify `expandedIds` resets to empty Set

### Unit Testing

**Specific Examples:**
- Toggle a single Module: verify it's added to `expandedIds`
- Toggle the same Module again: verify it's removed from `expandedIds`
- Toggle multiple Modules: verify each state change independently
- Render with empty `expandedIds`: verify all Modules rendered as collapsed
- Render with all IDs in `expandedIds`: verify all Modules rendered as expanded
- Error case: attempt to access `module.isExpanded` results in `undefined`

**Edge Cases:**
- Empty Module list
- Module with no children
- Module with deeply nested children
- Toggle Module that doesn't exist in the list
- Rapid successive toggles of the same Module
- Component re-render with prop changes

### Integration Testing

- Render StructureBuilder with sample module tree
- Click expand button, verify Module expands
- Click collapse button, verify Module collapses
- Toggle multiple Modules, verify each toggles independently
- Refresh component, verify expanded state resets
- Verify no module data is mutated during toggle operations
