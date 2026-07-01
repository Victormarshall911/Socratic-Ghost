# 👻 Socratic Ghost — AI-Powered Socratic Tutoring & Document Inquiry Web App

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.dot.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-3.x-000000?logo=vercel&logoColor=white)](https://sdk.vercel.ai/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Models-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

**Socratic Ghost** is an advanced interactive educational web application built on **Next.js 16** and the **Vercel AI SDK**. Rather than providing direct answers, Socratic Ghost embodies the Socratic method—analyzing uploaded study documents and guiding learners toward deep critical understanding through structured, probing questions and intelligent hints.

---

## ✨ Key Features

### 🧠 Socratic Inquiry Engine
- **Vercel AI SDK & Google Gemini**: Leverages `@ai-sdk/google` and `@ai-sdk/react` (`useChat`, `useCompletion`) to engage students in dynamic pedagogical dialogues.
- **Markdown & Interactive Formatting**: Render rich mathematical formulas, code blocks, and structured hints via `react-markdown`.

### 📂 Document & Study Note Uploads
- **Drag-and-Drop Ingestion**: Powered by `react-dropzone`, allowing instant drag-and-drop of lecture notes, PDFs, and essays for context-aware Socratic tutoring.

---

## 🛠️ Technology Stack

| Layer | Framework / Library |
| :--- | :--- |
| **Framework & UI** | Next.js 16, React 19, Tailwind CSS v4, Framer Motion v12 |
| **AI & LLM Integration** | Vercel AI SDK (`ai`, `@ai-sdk/react`), Google Gemini SDK |
| **Components & Utility** | Radix UI, Class Variance Authority (`cva`), React Dropzone |

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18+
- **Google Gemini API Key**

### 1. Install Dependencies
```bash
cd "Socratic Ghost"
npm install
```

### 2. Environment Setup (`.env.local`)
Create `.env.local`:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### 3. Start Next.js Dev Server
```bash
npm run dev
```
Open `http://localhost:3000`.

---

## 📄 License

Proprietary AI tutoring software. All rights reserved.
