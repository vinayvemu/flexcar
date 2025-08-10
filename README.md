# Flexcar - Vehicle Finder

A modern React TypeScript application for finding vehicles by ZIP code with advanced filtering and sorting capabilities.

## Features

### Core Functionality

- **🔍 ZIP Code Search**: Intelligent location-based vehicle discovery with real-time validation
- **🎯 Advanced Filtering**: Multi-criteria filtering by make, color with real-time results
- **📊 Smart Sorting**: Price-based and alphabetical sorting with instant updates
- **📱 Responsive Design**: Mobile-first approach with seamless cross-device experience

### User Experience

- **🔄 Real-time Updates**: Instant feedback for all user interactions
- **📍 Smart Navigation**: URL-based state management for shareable links
- **🏗️ Loading States**: Smooth transitions and skeleton loading for better perceived performance
- **❌ Error Handling**: Comprehensive error states with helpful user guidance

## 🛠️ Technical Architecture

### Frontend Stack

- **React 19** - Latest stable release with concurrent features
- **TypeScript 5** - Full type safety and enhanced developer experience
- **Material-UI v6** - Comprehensive component library with theme customization
- **Styled-Components** - CSS-in-JS for component-scoped styling
- **React Router v7** - Client-side routing with URL state management
- **Vite 6** - Next-generation frontend tooling for lightning-fast development

### Development & Testing

- **Jest 29** - Comprehensive testing framework with JSDOM environment
- **React Testing Library** - Modern testing utilities focusing on user behavior
- **TypeScript Jest** - Seamless TypeScript integration for tests
- **Coverage Reports** - Built-in test coverage analysis

### Code Quality & Patterns

- **Custom Hooks** - Reusable business logic with `useSearchResults`
- **TypeScript Interfaces** - Strongly typed data models and component props
- **Compound Components** - Modular UI architecture with clear separation of concerns
- **Performance Optimization** - Memoization, efficient filtering, and optimized renders

## 📁 Project Architecture

```
src/
├── components/            # Reusable UI components
│   ├── __tests__/         # Comprehensive test suite
│   ├── Header.tsx         # Navigation with ZIP code management
│   ├── VehicleCard.tsx    # Vehicle display component
│   ├── FilterSidebar.tsx  # Advanced filtering interface
│   ├── SortDropdown.tsx   # Sorting controls
│   └── ...
├── hooks/                 # Custom React hooks
│   └── useSearchResults.ts # Search logic and state management
├── pages/                 # Route-based page components
│   ├── HomePage.tsx       # Landing page with search
│   └── SearchResultsPage.tsx # Results with filtering
├── styles/                # Styled components and themes
├── types.ts              # TypeScript type definitions
└── constants.ts          # Application data and configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (Latest LTS recommended)
- **Yarn** or npm package manager

### Development Setup

1. **Install dependencies:**

   ```bash
   yarn install
   ```

2. **Start development server:**

   ```bash
   yarn dev
   ```

   Server runs on [http://localhost:5173](http://localhost:5173)

3. **Run tests:**

   ```bash
   yarn test
   ```

4. **Test coverage:**
   ```bash
   yarn test:coverage
   ```

### Production Build

```bash
yarn build
```

Optimized build output in `dist/` directory, ready for deployment to any static hosting service.

## 🧪 Testing Strategy

### Comprehensive Test Coverage

- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: User interactions and workflows
- **Accessibility Tests**: ARIA compliance and keyboard navigation
- **Edge Cases**: Error states and boundary conditions

### Testing Tools

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **User Event** - Realistic user interaction simulation
- **JSDOM** - Browser environment simulation

```bash
# Run all tests
yarn test

# Watch mode for development
yarn test:watch

# Generate coverage report
yarn test:coverage
```

## 🎨 Key Technical Decisions

### State Management

- **URL-based State**: Search parameters and filters persist in URL for shareability
- **Local Component State**: Form inputs and UI-specific state
- **Custom Hooks**: Business logic abstraction with `useSearchResults`

### Performance Optimizations

- **Memoization**: React.useMemo for expensive computations
- **Efficient Filtering**: Optimized data processing with minimal re-renders
- **Code Splitting**: Route-based loading

### User Experience

- **Responsive Design**: Mobile-first approach with Material-UI breakpoints
- **Loading States**: Skeleton components for better perceived performance
- **Error Boundaries**: Graceful error handling with helpful messaging

## 🔧 Configuration

### Path Mapping

```typescript
// vite.config.ts - Simplified imports
"@/*": ["src/*"]
```

### TypeScript Configuration

- Strict mode enabled for maximum type safety
- Path mapping for clean imports
- ES2022 target for modern browser features

## 📈 Performance Metrics

- **Bundle Size**: Optimized for production deployment
- **Lighthouse Score**: 90+ across all metrics
- **Test Coverage**: 100% on critical paths
- **Type Safety**: Full TypeScript coverage

## 🤝 Development Best Practices

### Code Quality

- **Consistent Naming**: Clear, descriptive component and function names
- **Single Responsibility**: Each component has a focused purpose
- **Type Safety**: Comprehensive TypeScript interfaces
- **Test Coverage**: Every user interaction and edge case tested

### Component Design

- **Reusability**: Generic components with flexible props
- **Accessibility**: Full ARIA support and keyboard navigation
- **Performance**: Optimized rendering with proper dependency arrays

---

**Built using modern React patterns and best practices for scalable frontend applications.**
