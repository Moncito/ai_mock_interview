<div align="center">

# 🎙️ PrepSaint — AI Mock Interview Platform

**Ace your next job interview with real-time AI voice practice and instant feedback.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

</div>

---

## 📌 Overview

**PrepSaint** is a full-stack AI-powered platform that simulates real job interviews through natural voice conversations. It generates tailored questions, conducts live voice interviews with an AI interviewer, and delivers detailed performance feedback — all personalized to your target role, experience level, and tech stack.

## ✨ Features

| Feature                          | Description                                                                                                                      |
| :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **🎤 Voice Interviews**          | Real-time voice conversations with an AI interviewer powered by Vapi, Deepgram (speech-to-text), and ElevenLabs (text-to-speech) |
| **🧠 Smart Question Generation** | Google Gemini 2.0 Flash generates 1–20 customized questions based on role, experience level, tech stack, and interview type      |
| **📊 AI Feedback & Scoring**     | Get scored 0–100 across 5 dimensions: Communication, Technical Knowledge, Problem Solving, Cultural Fit, and Confidence          |
| **🔐 Secure Authentication**     | Email/password auth via Firebase with server-side session cookies (httpOnly, 7-day expiry)                                       |
| **📋 Interview Dashboard**       | Track your interview history, view scores, browse other users' public interviews                                                 |
| **💻 100+ Tech Stack Icons**     | Visual tech stack display with icons for 100+ technologies                                                                       |

## 🏗️ Tech Stack

### Frontend

- **Next.js 15** (App Router + Turbopack)
- **React 19** with TypeScript 5
- **Tailwind CSS 4** + **Shadcn/ui** components
- **Zod** for schema validation
- **Sonner** for toast notifications

### AI & Voice

- **Vapi** — orchestrates real-time voice interviews
- **Google Gemini 2.0 Flash** — generates questions & analyzes transcripts
- **ElevenLabs** — AI voice synthesis (Sarah voice)
- **Deepgram Nova-2** — speech-to-text transcription
- **OpenAI GPT-4** — powers the conversational interview assistant

### Backend & Data

- **Firebase Auth** — user authentication
- **Cloud Firestore** — users, interviews, and feedback storage
- **Firebase Admin SDK** — server-side session verification
- **Next.js Server Actions** — secure server-side mutations

## 📂 Project Structure

```
app/
├── (auth)/                    # Auth routes (sign-in, sign-up)
├── (root)/                    # Protected routes
│   ├── page.tsx               # Dashboard
│   ├── interview/
│   │   ├── page.tsx           # Interview generation form
│   │   └── [id]/
│   │       ├── page.tsx       # Live interview session
│   │       └── feedback/      # AI feedback & scoring
│   └── middleware.ts          # Session verification
└── api/vapi/generate/         # Question generation API

components/
├── Agent.tsx                  # Voice interview engine (Vapi integration)
├── AuthForm.tsx               # Auth form with validation
├── InterviewCard.tsx          # Interview display card
├── DisplayTechIcons.tsx       # Tech stack icon renderer
└── ui/                        # Shadcn/ui base components

lib/
├── actions/                   # Server actions (auth, data)
├── vapi.sdk.ts                # Vapi client initialization
└── utils.ts                   # Utility helpers

firebase/
├── client.ts                  # Firebase client SDK config
└── admin.ts                   # Firebase Admin SDK config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (or yarn/pnpm/bun)
- A [Firebase](https://console.firebase.google.com/) project with Auth & Firestore enabled
- A [Vapi](https://vapi.ai/) account with a configured workflow

### 1. Clone the repository

```bash
git clone https://github.com/Moncito/ai_mock_interview.git
cd ai_mock_interview
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
# Vapi
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_service_account_private_key

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start practicing!

## 🔄 How It Works

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Sign Up /  │────▶│  Dashboard   │────▶│  Create New     │
│  Sign In    │     │  (History)   │     │  Interview      │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                    Select role, level, tech,
                                    interview type, # questions
                                                   │
                                                   ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Detailed   │◀────│  AI Analyzes │◀────│  Voice Interview│
│  Feedback   │     │  Transcript  │     │  with AI Agent  │
│  (5 scores) │     │  via Gemini  │     │  (Vapi + GPT-4) │
└─────────────┘     └──────────────┘     └─────────────────┘
```

1. **Generate** — Pick your role, experience level, tech stack, and interview type. Gemini creates tailored questions.
2. **Interview** — A voice AI conducts the interview in real-time using speech recognition and synthesis.
3. **Feedback** — After the interview, Gemini analyzes the full transcript and scores you across 5 key competencies.

## 📜 Available Scripts

| Script          | Description                     |
| :-------------- | :------------------------------ |
| `npm run dev`   | Start dev server with Turbopack |
| `npm run build` | Create production build         |
| `npm run start` | Start production server         |
| `npm run lint`  | Run ESLint                      |

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Moncito](https://github.com/Moncito)**

</div>
