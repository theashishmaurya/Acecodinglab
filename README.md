# AceCodingLab

<p align="center">
  <strong>A JS code lab for practicing interview design questions for UI Developers</strong>
</p>

<p align="center">
  <a href="https://acecodinglab.com">🌐 Website</a> •
  <a href="https://github.com/theashishmaurya/Acecodinglab/issues">🐛 Issues</a> •
  <a href="https://github.com/theashishmaurya/Acecodinglab/pulls">🔀 Pull Requests</a>
</p>

---

## 🚀 Features

- **Real-world Challenges**: Practice with actual interview questions from top tech companies
- **Interactive Code Editor**: Write and test your code in the browser
- **Multiple Difficulty Levels**: Challenges organized by Easy, Medium, and Hard
- **Company Tags**: See which companies ask each question
- **Progress Tracking**: Track your completed challenges (coming soon)

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with [Radix UI](https://www.radix-ui.com/) primitives
- **Backend**: [Supabase](https://supabase.com/) for authentication and database
- **Content**: MDX for challenge descriptions

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/theashishmaurya/Acecodinglab.git

# Navigate to the project directory
cd Acecodinglab

# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env.local

# Start the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn type-check` | Run TypeScript type checking |

## 🗂️ Project Structure

```
AcecodingLab/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard pages
│   └── lab/                # Coding challenge pages
├── components/             # React components
│   └── ui/                 # UI primitives
├── question/               # Challenge definitions
│   ├── accordion/          # Accordion challenge
│   ├── modal/              # Modal challenge
│   └── ...                 # Other challenges
├── lib/                    # Utility functions
├── hooks/                  # Custom React hooks
├── db/                     # Database client and types
└── public/                 # Static assets
```

## 🎯 Challenge Structure

Each challenge follows this structure:

```
question/
└── challenge-name/
    ├── metainfo.json      # Challenge metadata (name, difficulty, tags)
    ├── template/
    │   ├── question.mdx   # Challenge description
    │   ├── App.js         # Starter template
    │   ├── styles.css     # Styling
    │   └── *.test.jsx     # Test cases
```

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

### Adding a New Challenge

1. Create a new directory in `question/` with your challenge name
2. Add `metainfo.json` with challenge metadata
3. Create `template/` folder with:
   - `question.mdx` - Challenge description and requirements
   - `App.js` - Starter code template
   - `styles.css` - Basic styling
   - Test file with comprehensive test cases
4. Submit a pull request!

## 📋 Roadmap

- [ ] User authentication and progress tracking
- [ ] Challenge categories and tags filtering
- [ ] Code submission and verification
- [ ] Leaderboard system
- [ ] Company-specific challenge sets
- [ ] Monthly coding contests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Challenge inspirations from real interview experiences
- Built with amazing open-source tools
- Community contributions welcome!

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/theashishmaurya">Ashish Maurya</a>
</p>