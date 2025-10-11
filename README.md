# CodeWeaver AI

A powerful Next.js application that generates scripts in multiple programming languages using GPT-4, with AI-powered validation, syntax checking, and runtime error detection.

## Features

- **Multi-Language Support**: Generate scripts in Python, TypeScript, C#, and Go
- **AI-Powered Generation**: Uses GPT-4 via Vercel AI SDK for intelligent code generation
- **Three-Layer Validation**:
  - Syntax validation using language-specific compilers
  - Runtime execution in sandboxed environment
  - AI-powered code analysis for bugs, security, and best practices
- **Real-time Streaming**: See code generation happen in real-time
- **Modern UI**: Built with Next.js 14, Tailwind CSS, and shadcn/ui
- **Code Actions**: Copy and download generated scripts

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **AI**: Vercel AI SDK + OpenAI GPT-4
- **Code Highlighting**: React Syntax Highlighter with Prism
- **Validation**: Language-specific executors

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js 18+ (required for Next.js 14)
- pnpm (package manager)
- Python 3 (for Python script execution)
- Go (optional, for Go script execution)
- .NET SDK (optional, for C# script execution)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Edit the `.env.local` file and add your OpenAI API key:

```env
OPENAI_API_KEY=your_actual_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. TypeScript IDE Support

If you see TypeScript errors like "Cannot find module 'ai/react'":
- Restart your IDE or TypeScript server  
- In VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server"

## Usage

1. **Select a Language**: Choose from Python, TypeScript, C#, or Go
2. **Describe Your Script**: Enter what you want to create
3. **Generate**: Click "Generate Script"
4. **Validate**: Click "Validate & Execute Code" to check syntax, run code, and get AI analysis

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy!

## License

MIT
