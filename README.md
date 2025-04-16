# eduNumBlocksApps

A collection of educational applications designed to help children learn and practice mathematical concepts through interactive experiences. This repository contains several projects optimized for tablet devices, with a primary focus on Android tablets.

## Projects

### Calc Playground

A combined calculator and number blocks playground app for children's education, designed primarily for Android tablets and touch devices.

#### Features

- Interactive calculator with colorful number buttons
- Number blocks visualization for learning counting and basic math
- Drag and drop blocks for spatial organization
- Real-world examples for each number
- Mathematical "clubs" for understanding number properties (odd, even, prime, etc.)
- Custom block creation with different colors
- Responsive design optimized for tablets with special consideration for landscape orientation
- Offline functionality - works without internet access once downloaded

#### Technology

- React 19
- Vite
- React DnD for drag and drop
- Jest for testing
- Vanilla CSS (no frameworks or preprocessors)

[View Calc Playground README](calc-playground/README.md)

## Development Guidelines

All projects in this repository follow these guidelines:

### CSS Development

- Use vanilla CSS only, avoiding frameworks or preprocessors to keep file size minimal
- Implement mobile-first design principles with special consideration for landscape orientation
- Optimize primarily for Android tablets as the main platform
- Use bright, engaging colors appropriate for a child audience
- Create large, easily touchable buttons to accommodate children's motor skills
- Minimize reading requirements - prefer visual cues and simple instructions

### Code Organization

- Document code with comments placed on the right side of the relevant code
- Refactor repeated code into reusable functions
- Maintain comprehensive test coverage (minimum 75% for React applications)
- Keep total project size under 5MB to meet download requirements

### Testing Requirements

- Use Jest for JavaScript files 
- Maintain at least 75% test coverage for all React programs
- Ensure all tests pass with every code change

### Git Workflow

- Create separate development branches for features, bug fixes, or enhancements
- Use descriptive, present-tense commit messages
- Follow branch naming conventions:
  - `feature/feature-name` for new features
  - `bugfix/issue-description` for bug fixes
  - `hotfix/issue-description` for critical fixes
  - `release/version` for release preparation

## Getting Started

Each project has its own setup instructions. Navigate to the project directory and follow the README instructions to get started.

For Calc Playground:

```bash
cd calc-playground

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests with coverage
npm run test:coverage
```