# Developer Guide

This section provides comprehensive documentation for developers working on WdTmCollab, covering architecture, development patterns, and contribution guidelines.

## Project Architecture Overview

WdTmCollab is built with **Next.js 15** and **TypeScript**, following modern React development patterns with a strong focus on accessibility and performance.

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack React Query
- **Data Visualization**: D3.js
- **API Integration**: REST API with SPARQL backend
- **Build Tools**: Webpack with Turbopack
- **Accessibility**: WCAG 2.1 AA compliant

### Project Structure

```bash
WdTmCollab/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── actors/             # Actor collaboration pages
│   │   │   ├── [id]/           # Dynamic actor detail pages
│   │   │   │   └── collaborators/
│   │   │   └── page.tsx        # Main actors page
│   │   ├── compare/            # Compare movies/shows
│   │   │   └── page.tsx        # Compare page
│   │   ├── productions/        # Production-related pages
│   │   │   ├── [id]/           # Dynamic production detail pages
│   │   │   └── page.tsx        # Productions listing
│   │   ├── shared-castings/    # Shared casting analysis
│   │   │   └── page.tsx        # Shared castings page
│   │   ├── feed/               # Loading components
│   │   │   └── loading.tsx     # Loading page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── actors/             # Actor-specific components
│   │   │   ├── actor-card.tsx      # Actor display card
│   │   │   └── collaborator-list.tsx # Collaborator list
│   │   ├── compare/            # Compare page components
│   │   │   └── searchComponent.tsx  # Movie search component
│   │   ├── layout/             # Layout components
│   │   │   ├── header.tsx          # Site header
│   │   │   ├── footer.tsx          # Site footer
│   │   │   ├── navigation.tsx      # Main navigation
│   │   │   └── skip-nav.tsx        # Skip navigation (accessibility)
│   │   ├── productions/        # Production components
│   │   │   └── production-card.tsx # Production display card
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── button.tsx          # Button component
│   │   │   ├── card.tsx            # Card component
│   │   │   ├── error-boundary.tsx  # Error boundary
│   │   │   ├── form-input.tsx      # Form input wrapper
│   │   │   ├── input.tsx           # Input component
│   │   │   └── skeleton-loader.tsx # Loading skeleton
│   │   ├── searchComponent.tsx     # Actor search component
│   │   └── visualizations/         # D3.js visualizations
│   │       └── collaboration-network.tsx # Network visualization
│   ├── hooks/                  # Custom React hooks
│   │   ├── client-providers.tsx    # React Query provider
│   │   └── api/                # API integration hooks
│   │       ├── useActorSearch.ts   # Actor search hook
│   │       ├── useActors.ts        # Actor details and co-actors
│   │       ├── useProductSearch.ts # Movie/TV search
│   │       └── useSharedCsting.ts  # Shared productions
│   ├── utils/                  # Utility functions
│   │   └── endpoints.ts            # API endpoint definitions
│   ├── types/                  # TypeScript type definitions
│   └── lib/                    # Third-party integrations
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── .env.example                # Environment template
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

### Data Flow Architecture

#### 1. **Client-Server Communication**

```test
Frontend (React/Next.js) ↔️ Backend API ↔️ Wikidata SPARQL Query Service
```

#### 2. **State Management Flow**

```md
UI Components → Custom Hooks → TanStack React Query → API Endpoints → Backend
     ↑                                                              ↓
     ←───────── Cached Data ←───────── Query Results ←─────────────┘
```

#### 3. **Component Data Flow**

```md
Pages → Search Components → API Hooks → Results Display
  ↑                                                  ↓
  ←───────── URL Parameters ←────────────────────────┘
```

### API Integration Guide

The application uses a centralized API integration pattern with custom hooks and endpoint management.

#### Centralized Endpoints (`utils/endpoints.ts`)

All API endpoints are defined in a single file for consistency:

```typescript
// utils/endpoints.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://wdtmcollab-api.toolforge.org";

export const endpoints = {
  // Actor-related endpoints
  actorSearch: (name: string) =>
    `${API_BASE_URL}/actors/search?name=${encodeURIComponent(name)}`,
  actorDetails: (id: string) =>
    `${API_BASE_URL}/actors/details/${encodeURIComponent(id)}`,
  co_ActorSearch: (actorId: string) =>
    `${API_BASE_URL}/actors/co-actors?actorId=${encodeURIComponent(actorId)}`,
  actorPopular: () => `${API_BASE_URL}/actors/popular`,

  // Production-related endpoints
  movieSearch: (title: string) =>
    `${API_BASE_URL}/productions/search?title=${encodeURIComponent(title)}`,
  productionsShared: (actor1Id: string, actor2Id: string) =>
    `${API_BASE_URL}/productions/shared?actor1Id=${encodeURIComponent(
      actor1Id
    )}&actor2Id=${encodeURIComponent(actor2Id)}`,
  sharedActors: (movie1Id: string, movie2Id: string) =>
    `${API_BASE_URL}/productions/shared-actors?movie1=${encodeURIComponent(
      movie1Id
    )}&movie2=${encodeURIComponent(movie2Id)}`
};
```

#### Custom API Hooks (`src/hooks/api/`)

Each API endpoint has a corresponding custom hook:

```typescript
// Example: Actor search hook
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";

export interface Actor {
  id: string;
  label: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export function useActorSearch(query: string) {
  return useQuery<Actor[]>({
    queryKey: ["actorSearch", query],
    queryFn: async () => {(
      const res = await fetch(endpoints.actorSearch(query));
      if (!res.ok) throw new Error("Failed to search actors");
    },
    return res
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
```

#### Using API Hooks in Components

```typescript
"use client";

import { useActorSearch } from "@/hooks/api/useActors";

export default function SearchComponent() {
  const { data: actors = [], isLoading, isError } = useActorSearch(searchQuery);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading actors</div>;

  return (
    <ul>
      {actors.map((actor) => (
        <li key={actor.id}>{actor.label}</li>
      ))}
    </ul>
  );
}
```

### How to Add a New Search Page

Follow these steps to add a new search page:

#### Step 1: Define API Endpoint

Add your new endpoint to `utils/endpoints.ts`:

```typescript
export const endpoints = {
  // ... existing endpoints
  newEntitySearch: (query: string) => ({
    `${API_BASE_URL}/new-entity/search?query=${encodeURIComponent(query)}`
    });
};
```

#### Step 2: Create API Hook

Create a new hook in `src/hooks/api/useNewEntitySearch.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";

export interface NewEntity {
  id: string;
  label: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export function useNewEntitySearch(query: string) {
  return useQuery<NewEntity[]>({
    queryKey: ["newEntitySearch", query],
    queryFn: async () => {
      const res = await fetch(endpoints.newEntitySearch(query));
      if (!res.ok) throw new Error("Failed to search entities");
      return res.json();
    },
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000
  });
}
```

#### Step 3: Create Search Component

Create `src/components/search/new-entity-search.tsx`:

```typescript
"use client";

import React, { useState } from "react";
import { useNewEntitySearch, NewEntity } from "@/hooks/api/useNewEntitySearch";

interface NewEntitySearchProps {
  onSelect: (entity: NewEntity | null) => void;
  placeholder?: string;
}

export default function NewEntitySearch({
  onSelect,
  placeholder = "Search entities..."
}: NewEntitySearchProps) {
  const [query, setQuery] = useState("");
  const { data: results = [], isLoading } = useNewEntitySearch(query);

  return (
    <div className='w-full max-w-md mx-auto'>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className='w-full p-3 border rounded-lg'
      />

      {isLoading && <div>Loading...</div>}

      {results.length > 0 && (
        <ul className='mt-2 bg-white border rounded-lg shadow-lg'>
          {results.map((entity) => (
            <li
              key={entity.id}
              onClick={() => onSelect(entity)}
              className='p-3 hover:bg-gray-100 cursor-pointer'
            >
              {entity.label}
              {entity.description && (
                <p className='text-sm text-gray-600'>{entity.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#### Step 4: Create Page

Create `src/app/new-entities/page.tsx`:

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import NewEntitySearch from "@/components/search/new-entity-search";
import { NewEntity } from "@/hooks/api/useNewEntitySearch";

export default function NewEntitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const entityId = searchParams.get("entityId") || "";
  const entityLabel = searchParams.get("label") || "";

  const handleSelectEntity = (selectedEntity: NewEntity | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedEntity) {
      params.set("entityId", selectedEntity.id);
      params.set("label", selectedEntity.label);
    } else {
      params.delete("entityId");
      params.delete("label");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <main className='min-h-screen bg-slate-50 pt-16 px-4'>
      <div className='container mx-auto max-w-4xl'>
        <h1 className='text-4xl font-bold text-center mb-8'>
          Search New Entities
        </h1>

        <div className='bg-white rounded-xl shadow-lg p-8'>
          <NewEntitySearch
            onSelect={handleSelectEntity}
            initialValue={entityLabel}
          />

          {/* Display results based on selected entity */}
          {entityId && (
            <div className='mt-8'>
              <h2 className='text-2xl font-bold'>
                Details for:{" "}
                <span className='text-blue-600'>{entityLabel}</span>
              </h2>
              {/* Add your entity details display here */}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
```

#### Step 5: Add Navigation Link

Update `src/components/layout/navigation.tsx`:

```typescript
<li>
  <Link
    href='/new-entities'
    className='text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1'
    aria-label='Search new entities'
  >
    New Entities
  </Link>
</li>
```

### Component Structure and Best Practices

#### Component Organization

- **One component per file**: Each file contains exactly one React component
- **PascalCase naming**: All components use PascalCase (e.g., `ActorCard.tsx`)
- **Functional components**: Use functional components with hooks instead of class components
- **TypeScript strict typing**: All components must have proper TypeScript interfaces

#### Component Patterns

##### 1. **Presentational Components**

```typescript
interface ComponentProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export default function FeatureCard({
  title,
  description,
  onClick
}: ComponentProps) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='font-bold text-lg mb-2'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
      {onClick && (
        <button
          onClick={onClick}
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded'
        >
          Click me
        </button>
      )}
    </div>
  );
}
```

##### 2. **Container Components**

```typescript
"use client";

import { useState, useEffect } from "react";
import { useActorDetails } from "@/hooks/api/useActors";

export default function ActorDetails({ actorId }: { actorId: string }) {
  const { data: actor, isLoading, isError } = useActorDetails(actorId);

  if (isLoading) return <SkeletonLoader />;
  if (isError) return <ErrorMessage />;
  if (!actor) return <NotFound />;

  return (
    <div className='actor-details'>
      <h1>{actor.name}</h1>
      {actor.bio && <p>{actor.bio}</p>}
      {/* ... other actor details */}
    </div>
  );
}
```

##### 3. **Custom Hooks Pattern**

```typescript
// Use existing hooks for composition
export function useActorCollaboration(actorId: string) {
  const { data: coActors } = useCoActors(actorId, 1, 10);
  const { data: actorDetails } = useActorDetails(actorId);

  return {
    actor: actorDetails,
    collaborators: coActors,
    isLoading: !coActors || !actorDetails
  };
}
```

#### Styling Guidelines

- **Tailwind CSS**: Use Tailwind utility classes for all styling
- **Responsive design**: Mobile-first approach with responsive utilities
- **Consistent spacing**: Use consistent spacing scale (4px, 8px, 16px, 24px, 32px)
- **Color scheme**: Follow the established blue-gray color palette

```typescript
// Good example
<div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
  <h3 className='font-bold text-lg mb-4'>{title}</h3>
  <p className='text-gray-600'>{description}</p>
</div>

// Avoid inline styles or custom CSS classes
```

#### Accessibility Guidelines

- **WCAG 2.1 AA compliance**: All components must meet accessibility standards
- **Semantic HTML**: Use proper HTML elements (`<button>`, `<nav>`, `<main>`, etc.)
- **ARIA labels**: Add proper ARIA labels and roles
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
- **Focus management**: Implement proper focus indicators

```typescript
// Accessible component example
<button
  aria-label='Clear search results'
  className='focus:outline-none focus:ring-2 focus:ring-blue-600'
  onClick={handleClear}
>
  <svg aria-hidden='true' focusable='false'>
    {/* Icon */}
  </svg>
</button>
```

### Environment Variables and Configuration

#### Required Environment Variables

Create a `.env.local` file in the project root:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://wdtmcollab-api.toolforge.org

# Optional: Development API (for local testing)
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

#### Configuration Files

##### `next.config.ts`

- Next.js configuration
- Webpack optimizations
- Bundle analyzer setup
- Image optimization settings

##### `tailwind.config.ts`

- Tailwind CSS configuration
- Content paths for purging
- Custom color schemes

##### `tsconfig.json`

- TypeScript compiler options
- Path mapping (`@/*` → `./*`)
- Strict type checking enabled

##### `.eslintrc.js`

- ESLint rules for code quality
- TypeScript-specific linting
- Import order and naming conventions

### Testing Guidelines

#### Current Testing Setup

The project currently has:

- **ESLint**: Code quality and consistency checking
- **TypeScript**: Static type checking
- **Bundle Analysis**: Size monitoring with `@next/bundle-analyzer`

#### Recommended Testing Setup

For future test implementation:

##### 1. **Unit Tests** (Recommended: Jest + React Testing Library)

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```typescript
// Example component test
import { render, screen } from "@testing-library/react";
import ActorCard from "@/components/actors/actor-card";

describe("ActorCard", () => {
  it("displays actor name and image", () => {
    const mockActor = {
      id: "Q123",
      name: "John Doe",
      imageUrl: "https://example.com/image.jpg"
    };

    render(<ActorCard {...mockActor} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByAltText("John Doe")).toBeInTheDocument();
  });
});
```

##### 2. **Integration Tests**

```typescript
// Example API hook test
import { renderHook, waitFor } from "@testing-library/react";
import { useActorSearch } from "@/hooks/api/useActors";

// Mock fetch
global.fetch = jest.fn();

describe("useActorSearch", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [{ id: "Q123", label: "Test Actor" }]
    });
  });

  it("fetches actors based on query", async () => {
    const { result } = renderHook(() => useActorSearch("test"));

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    expect(result.current.data[0].label).toBe("Test Actor");
  });
});
```

##### 3. **E2E Tests** (Recommended: Playwright)

```bash
# Install Playwright
npm install --save-dev @playwright/test
```

```typescript
// Example E2E test
import { test, expect } from "@playwright/test";

test("actor search functionality", async ({ page }) => {
  await page.goto("/actors");

  await page.fill('[aria-label="Search for actors"]', "Keanu Reeves");
  await page.click('[role="option"]');

  await expect(page.locator("text=Collaborators of")).toBeVisible();
  await expect(page.locator("text=Keanu Reeves")).toBeVisible();
});
```

### Test Implementation Best Practices

1. **Test Location**: Place test files alongside components (`Component.test.tsx`)
2. **Naming Convention**: Use `.test.ts` or `.spec.ts` for test files
3. **Test Coverage**: Aim for >80% coverage on critical paths
4. **Accessibility Testing**: Include accessibility tests for all interactive components
5. **API Mocking**: Mock API calls to avoid external dependencies in tests

### Running Tests

```bash
# When tests are implemented
npm run test              # Run unit tests
npm run test:e2e          # Run E2E tests
npm run test:coverage     # Run with coverage report
npm run lint              # Run ESLint
```

### Development Workflow

#### 1. **Local Development**

```bash
# Clone and setup
git clone https://gerrit.wikimedia.org/r/labs/tools/WdTmCollab
cd WdTmCollab
npm install

# Start development server
npm run dev
```

#### 2. **Code Quality**

```bash
# Check for linting errors
npm run lint

# Type checking
npx tsc --noEmit

# Bundle analysis (optional)
npm run build
```

#### 3. **Adding New Features**

1. Create feature branch from `main`
2. Implement components and API hooks
3. Add proper TypeScript types
4. Ensure accessibility compliance
5. Test locally with `npm run dev`
6. Submit for review on Gerrit

### Performance Considerations

#### 1. **React Query Optimization**

- Uses 5-minute stale time for API responses
- Automatic background refetching
- Optimistic updates for better UX

#### 2. **Component Optimization**

- Lazy loading for large lists
- Memoization for expensive calculations
- Proper dependency arrays in hooks

#### 3. **Bundle Optimization**

- Tree shaking for unused code
- Dynamic imports for route-based code splitting
- Bundle analysis monitoring

### Troubleshooting Common Issues

#### API Connection Issues

```bash
# Check environment variables
echo $NEXT_PUBLIC_API_BASE_URL

# Test API connectivity
curl https://wdtmcollab-api.toolforge.org/actors/popular
```

#### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --showConfig

# Verify path mappings in tsconfig.json
```

### Contributing Guidelines

1. **Code Style**: Follow existing patterns and use ESLint rules
2. **Accessibility**: Maintain WCAG 2.1 AA compliance
3. **Testing**: Add tests for new functionality
4. **Documentation**: Update this guide for significant changes
5. **Commits**: Use clear, descriptive commit messages
6. **Reviews**: Submit code for peer review via Gerrit

For detailed contribution guidelines, see the [Wikimedia Gerrit Tutorial](https://www.mediawiki.org/wiki/Gerrit/Tutorial).
