# VEXUS ATLAS Conversion Recipe - Usage Guide

## How to Use the System Prompt

### Step 1: Prepare the Conversion Context
Before using the system prompt, gather these materials:

1. **Target Astro File**: The `.astro` page you want to convert
2. **Conversion Outline**: The corresponding `.md` file from the conversion-outlines directory
3. **System Prompt**: The `conversion-recipe-system-prompt.md` content

### Step 2: Structure Your Prompt to the LLM

```
SYSTEM MESSAGE:
[Insert the entire conversion-recipe-system-prompt.md content here]

USER MESSAGE:
Convert the following Astro page to React with MUI following the conversion recipe:

**Astro File Path**: /path/to/page.astro
**Astro File Content**:
```astro
[Insert the full .astro file content here]
```

**Conversion Outline**:
[Insert the corresponding .md conversion outline content here]

Please convert this Astro page to a React component with MUI following all the patterns and requirements specified in the system prompt. Ensure all text content, functionality, and visual design are preserved.
```

### Step 3: Expected Output
The LLM should provide:

1. **Complete React Component** with proper imports
2. **MUI Component Integration** following best practices
3. **Preserved Content** - all text and functionality intact
4. **Responsive Design** using MUI breakpoint system
5. **State Management** for interactive features
6. **Comments** explaining complex conversions

### Step 4: Validation Checklist
After receiving the converted component, verify:

- [ ] All text content from original is present
- [ ] Interactive elements work (forms, buttons, modals)
- [ ] Styling matches the original visual design
- [ ] Responsive behavior is maintained
- [ ] MUI components are used appropriately
- [ ] Component follows React best practices

## Example Workflow

### Input Files:
- `vexus-astro-new copy/src/pages/about.astro`
- `conversion-outlines/about.md`

### Expected Output:
- `src/pages/About.jsx` (React component)
- All content preserved
- MUI Card, Typography, Container components used
- Responsive design with MUI breakpoints
- SEO component integration

### Quick Test:
The converted component should be immediately usable in a React app with:
```jsx
import About from './pages/About';
// Component should render without errors and match original design
```

## Troubleshooting Common Issues

### If the LLM skips content:
- Emphasize "preserve ALL text content exactly"
- Provide specific examples of missing content
- Reference the checklist in the system prompt

### If styling doesn't match:
- Point to the MUI sx prop patterns in the system prompt
- Emphasize the visual design preservation requirement
- Provide specific styling requirements

### If interactive features break:
- Reference the React hooks conversion patterns
- Emphasize functionality preservation requirement
- Ask for state management implementation

## Advanced Usage

### For Complex Pages:
1. Break large pages into smaller sections
2. Convert section by section
3. Combine sections into the complete page
4. Test each section individually

### For Custom Functionality:
1. Identify unique interactive elements
2. Provide specific conversion requirements
3. Reference the "Error Handling & Edge Cases" section
4. Ask for custom React hook implementations

This system prompt and usage guide should enable consistent, high-quality conversions from Astro to React + MUI while preserving all functionality and design elements. 