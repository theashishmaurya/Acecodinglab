# Contributing to AceCodingLab

Thank you for your interest in contributing to AceCodingLab! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

- **Add a new challenge**: Create a new coding challenge for the community
- **Improve existing challenges**: Fix bugs, add tests, or improve descriptions
- **Report bugs**: Open an issue with a clear description
- **Suggest features**: Share your ideas for new features
- **Improve documentation**: Help make our docs better

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/Acecodinglab.git
cd Acecodinglab

# Add upstream remote
git remote add upstream https://github.com/theashishmaurya/Acecodinglab.git
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Create a Branch

```bash
git checkout -b feat/your-feature-name
```

## 📝 Adding a New Challenge

### Challenge Directory Structure

```
question/
└── your-challenge-name/
    ├── metainfo.json      # Required: Challenge metadata
    ├── metaInfo.json      # Required: Duplicate of metainfo.json
    └── template/
        ├── question.mdx   # Required: Challenge description
        ├── App.js         # Required: Starter template
        ├── styles.css     # Required: Styling
        └── challenge.test.jsx  # Required: Test cases
```

### metainfo.json Format

```json
{
  "name": "Challenge Name",
  "key": "challenge-name",
  "tags": ["accessibility", "keyboard-nav", "intermediate"],
  "difficulty": "medium",
  "author": "Your Name",
  "company": ["Google", "Meta", "Amazon"]
}
```

#### Difficulty Levels
- `easy` - Beginner-friendly, basic concepts
- `medium` - Intermediate complexity
- `advanced` - Expert-level challenges

#### Common Tags
- `accessibility` - ARIA, screen reader support
- `keyboard-nav` - Keyboard navigation patterns
- `api-calls` - Fetch/data loading
- `animation` - Motion/transitions
- `state-management` - Complex state logic
- `drag-drop` - Drag and drop interactions

### question.mdx Format

```mdx
# Challenge Title

## Task Description
Brief description of what to build.

## Requirements
- Requirement 1
- Requirement 2

## Evaluation Criteria
What will be tested.

## Bonus
Optional extra challenges.

Good luck!
```

### Test File Guidelines

- Test the primary functionality
- Test accessibility attributes
- Test keyboard interactions
- Test edge cases
- Use descriptive test names

## 🎨 Code Style

- Use TypeScript for new code
- Follow existing code formatting
- Run `yarn lint` before committing
- Run `yarn type-check` to verify types

## ✅ Pull Request Process

1. **Create a descriptive PR title**
   - `feat: Add Modal challenge`
   - `fix: Correct accordion keyboard navigation`
   - `docs: Update README with new instructions`

2. **Fill out the PR template**
   - Describe your changes
   - Link related issues
   - Add screenshots if applicable

3. **Ensure CI passes**
   - Lint checks
   - Type checks
   - Build

4. **Request review**
   - Wait for maintainer review
   - Address feedback

## 💡 Best Practices

### For Challenges
- Start with a clear problem statement
- Provide realistic requirements
- Include comprehensive tests
- Add helpful comments in starter code
- Consider accessibility from the start

### For Code
- Keep components focused and small
- Use semantic HTML
- Add ARIA attributes when needed
- Handle keyboard interactions
- Write meaningful comments

## 🐛 Reporting Issues

When reporting bugs, please include:

1. **Description**: What happened?
2. **Steps to reproduce**: How can we see the issue?
3. **Expected behavior**: What should happen?
4. **Screenshots**: If applicable
5. **Environment**: Browser, OS, etc.

## 📞 Questions?

Feel free to open an issue with the `question` label or reach out on Twitter [@ashishmaurya](https://twitter.com/ashishmaurya).

---

Thank you for contributing! 🎉