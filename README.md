![](https://github.com/nemolize/next-todo/workflows/production/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/nemolize/next-todo/branch/master/graph/badge.svg)](https://codecov.io/gh/nemolize/next-todo)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

# next-todo

A todo list manager example made with [Next.js](https://nextjs.org/).
`Next.js` version of [nuxt-todo](https://github.com/nemolize/nuxt-todo) implementation.

Demo:
https://next-todo.netlify.com

## Features

- **Add/Delete/Toggle**: You can `add` or `delete` todo items, and `toggle` completion by clicking checkbox
- **Modal Confirmation**: `Modal dialog` for item delete confirmation
- **Modern React**: Built with `Function Components` and `React Hooks` for state management
- **Data Persistence**: Todo items are persisted to `LocalStorage`

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI Library**: [React](https://reactjs.org/) with Hooks
- **Styling**: [Bulma](http://bulma.io) CSS framework with SCSS
- **Type Safety**: [PropTypes](https://www.npmjs.com/package/prop-types) for runtime type checking
- **Code Quality**: [Biome](https://biomejs.dev/) for linting and formatting
- **Testing**: [Jest](https://jestjs.io/) with [Enzyme](https://enzymejs.github.io/enzyme/) for component testing
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Deployment**: [Netlify](https://www.netlify.com/) for demo site
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (recent LTS version recommended)
- [pnpm](https://pnpm.io/) package manager

### Installation

```bash
# Clone the repository
git clone git@github.com:nemolize/next-todo.git
cd next-todo

# Install dependencies
pnpm install
```

## Development

```bash
# Start development server with hot reload at localhost:3000
pnpm dev

# Run tests with coverage report
pnpm test

# Lint code for quality and style issues
pnpm lint

# Automatically fix lint issues
pnpm lint:fix

# Type checking (uses linting rules for type validation)
pnpm typecheck

# Build and generate static project for production
pnpm build
```

## Project Structure

```
next-todo/
├── components/          # React components
│   ├── delete-modal.jsx # Delete confirmation modal
│   ├── head.jsx         # HTML head component
│   ├── todo-add.jsx     # Add todo form
│   └── todo-list.jsx    # Todo list display
├── pages/               # Next.js pages
│   ├── _app.jsx         # App wrapper
│   └── index.jsx        # Main todo page
├── styles/              # Global styles
├── test/                # Test files
└── static/              # Static assets
```
