# WdTmCollab

_**WdTmCollab**_ (Wikidata Transmedia Collaboration Explorer) is a tool which leverages Wikidata’s structured film and television data to analyze their partnerships, identifying frequent collaborators and shared projects while extending insights to directors and producers for a comprehensive view of industry dynamics.

## Developer Set up

* Browse and clone the code from the [repository](https://gerrit.wikimedia.org/r/admin/repos/labs/tools/WdTmCollab) on gerrit.

* Run the `npm install` command

* Run the frontend locally :

  ```bash
  npm run dev
  # or
  yarn dev
  # or
  pnpm dev
  # or
  bun dev
  ```

The application [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Accessibility

WdTmCollab is committed to providing an accessible experience for all users. The application follows WCAG 2.1 AA standards.

### Accessibility Features

- **Keyboard Navigation**: Full keyboard support with visible focus indicators throughout the application
- **Screen Reader Support**: Proper ARIA labels, roles, and semantic HTML for assistive technologies
- **Skip Navigation**: Skip-to-main-content link for keyboard users
- **Color Contrast**: All text meets WCAG AA contrast ratios (minimum 4.5:1 for normal text)
- **Reduced Motion**: Respects `prefers-reduced-motion` user preferences
- **Accessible Forms**: All inputs have proper labels and error handling
- **Focus Management**: Clear focus indicators and logical tab order

### Testing

The application has been tested with:
- Keyboard navigation (Tab, Enter, Space keys)
- Screen readers (Orca for linux)
- Automated tools (you can use axe DevTools, WAVE, i used Lighthouse for chrome)
- Color contrast checkers

### Detailed Implementation

#### 1. Skip Navigation
- Located in `src/components/layout/skip-nav.tsx`
- Allows keyboard users to skip directly to main content
- Hidden by default, visible on Tab focus
- Meets WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)

#### 2. Semantic HTML & ARIA Landmarks
- **Header**: `role="banner"` for site header
- **Navigation**: `role="navigation"` with `aria-label="Main navigation"`
- **Main Content**: `role="main"` with `id="main-content"` for skip link target
- **Search**: `role="search"` for search components
- **Footer**: Semantic `<footer>` element

#### 3. Keyboard Navigation
- All interactive elements are keyboard accessible via Tab
- Visible focus indicators on all focusable elements
- Logical tab order throughout the application
- Enter/Space key support on custom interactive elements

#### 4. ARIA Labels & Roles

**Search Component:**
- Input: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls`
- Results: `role="listbox"` container with `role="option"` items
- Live regions: `aria-live="polite"` for result count announcements
- Loading states: `role="status"` with screen reader text

**Navigation:**
- Descriptive `aria-label` on each navigation link
- `role="list"` for navigation menu

**Buttons:**
- Clear `aria-label` for icon-only buttons (e.g., "Clear selected actor")
- Keyboard support with Enter/Space keys

#### 5. Focus Indicators
- Global focus styles defined in `src/app/globals.css`
- 2px solid blue outline (`#2563eb`)
- 2px offset for better visibility
- `:focus-visible` support for keyboard-only focus indication
- Applied to links, buttons, inputs, and all interactive elements

#### 6. Screen Reader Support

**Hidden Content:**
- `.sr-only` class hides content visually while keeping it accessible to screen readers
- Used for: form labels, loading states, result counts, descriptive text

**Live Regions:**
- `aria-live="polite"` for non-urgent updates
- Search result count announcements
- Loading state announcements

**Decorative Elements:**
- `aria-hidden="true"` on decorative icons
- `focusable="false"` on SVG elements
- Empty `alt=""` for decorative images

#### 7. Color Contrast (WCAG AA Compliant)
All text meets minimum contrast ratios:
- Normal text (< 18pt): 4.5:1 minimum
- Large text (≥ 18pt or 14pt bold): 3:1 minimum

Tested combinations:
- Gray text (`#4B5563`) on white: 7.59:1 
- Blue links (`#1D4ED8`) on white: 8.59:1 
- Blue buttons (`#2563EB`) with white text: 8.17:1 

#### 8. Reduced Motion Support
- Respects `prefers-reduced-motion` media query
- Disables animations for users with motion sensitivity
- Implemented in `src/app/globals.css`

#### 9. Common Accessible Patterns Used

**Accessible Button:**
```tsx
<button
  aria-label="Clear search"
  className="focus:outline-none focus:ring-2 focus:ring-blue-600"
>
  <svg aria-hidden="true" focusable="false">
    {/* Icon */}
  </svg>
</button>
```

**Accessible Link:**
```tsx
<Link
  href="/page"
  aria-label="Descriptive label"
  className="focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
>
  Link Text
</Link>
```

**Accessible Form Input:**
```tsx
<label htmlFor="input-id" className="block mb-2">
  Label Text
</label>
<input
  id="input-id"
  type="text"
  aria-required="true"
  className="focus:ring-2 focus:ring-blue-600"
/>
```

**Accessible Search:**
```tsx
<div role="search">
  <label htmlFor="search" className="sr-only">Search</label>
  <input
    id="search"
    role="combobox"
    aria-autocomplete="list"
    aria-expanded={hasResults}
    aria-controls="results-id"
  />
  <ul id="results-id" role="listbox">
    <li role="option">Result</li>
  </ul>
</div>
```

### Testing with Screen Readers

**For Linux (Orca):**
```bash
sudo apt install orca
orca &  # Start Orca
firefox http://localhost:3000  # Open in Firefox
```

**Orca Commands:**
- **Insert + Down Arrow**: Read entire page
- **Down Arrow**: Read next line
- **H**: Jump to next heading
- **Tab**: Navigate interactive elements
- **Insert + Space**: Toggle focus/browse mode

**Expected Announcements:**
- "Skip to main content, link"
- "Search for actors by name, entry"
- "Main navigation"
- Proper descriptions for all links and buttons
- Result counts when searching

### Reporting Accessibility Issues

If you encounter any accessibility barriers, please [report them via Phabricator](https://phabricator.wikimedia.org/maniphest/task/edit/form/43/?tag=WdTmCollab) with the tag "accessibility".

## Get Involed

* Have a look at our [phabricator](https://phabricator.wikimedia.org/project/profile/7831/) tasks and help handle some of the interesting concerns we may have. The [Gerrit Tutorial](https://www.mediawiki.org/wiki/Gerrit/Tutorial) will be a good place to begin if you haven't contributed to wikimedia yet!

* Help us know what we can work on next or fix by completing our [feature request](https://phabricator.wikimedia.org/maniphest/task/edit/form/102/?tag=WdTmCollab) form.

* Noticed a `Bug`? please help us describe the issue you are facing using our [bug report](https://phabricator.wikimedia.org/maniphest/task/edit/form/43/?tag=WdTmCollab) form.
