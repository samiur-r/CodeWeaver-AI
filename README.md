# CodeWeaver AI

AI-powered code generator with validation. Generate scripts in Python, TypeScript, C#, and Go using GPT-4.1.

## ✨ Features

- AI script generation with streaming
- Syntax validation + runtime execution
- AI-powered code analysis
- Copy & download generated code
- Modern UI with Tailwind + shadcn/ui

## Quick Start

**1. Install dependencies**
```bash
pnpm install
```

**2. Add your OpenAI API key**
```bash
# Edit .env.local
OPENAI_API_KEY=your_key_here
```


**3. Run dev server**
```bash
pnpm dev
```
Open http://localhost:3000

## 💻 Usage

1. Select a language (Python, TypeScript, C#, or Go)
2. Describe what you want to build
3. Click "Generate Script" → watch AI write code
4. Click "Validate & Execute" → see syntax check, execution results, and AI feedback

## 🛠 Tech Stack

Next.js 16 • TypeScript • Tailwind CSS • Vercel AI SDK • OpenAI GPT-4.1

## 📦 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import to Vercel
3. Add `OPENAI_API_KEY` env variable

## 📝 License

MIT
