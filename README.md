# PrepSaint - AI-Powered Mock Interview Platform

PrepSaint is an intelligent mock interview platform that helps job seekers practice and improve their interview skills through AI-powered conversations and personalized feedback.

## 🌟 Features

### 🎤 AI-Powered Mock Interviews
- Real-time voice conversations with an AI interviewer
- Dynamic interview generation based on role and tech stack
- Natural conversation flow with speech recognition
- Live transcription of interview dialogue

### 📊 Intelligent Feedback System
- Comprehensive performance analysis using Google Gemini AI
- Detailed scoring across multiple categories:
  - Communication Skills
  - Technical Knowledge
  - Problem-Solving Abilities
  - Cultural & Role Fit
  - Confidence & Clarity
- Personalized strengths and areas for improvement
- Final assessment with actionable recommendations

### 👤 User Management
- Secure authentication with Firebase
- User profile management
- Interview history tracking
- Session-based authentication with secure cookies

### 🎯 Interview Library
- Browse available interview templates
- View past interview performances
- Track progress over time
- Access community-generated interviews

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Dark mode support
- Smooth animations and transitions
- Accessible components with ARIA support
- Toast notifications for user feedback

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Lucide React
- **Animations**: Tailwind Animate, tw-animate-css
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js Server Actions
- **Database**: Firebase Firestore
- **Authentication**: Firebase Admin SDK
- **AI Integration**: 
  - Google Gemini 2.0 Flash (via AI SDK)
  - Vapi AI for voice interactions

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript 5
- **Build Tool**: Turbopack

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase project set up
- Google AI API key
- Vapi AI account and API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai_mock_interview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # App Configuration
   NEXT_PUBLIC_BASE_URL=your-app-url

   # Firebase Configuration
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="your-private-key"
   FIREBASE_CLIENT_EMAIL=your-client-email

   # Google AI
   GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key

   # Vapi AI
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your-vapi-token
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your-workflow-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai_mock_interview/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   │   ├── sign-in/         # Sign in page
│   │   └── sign-up/         # Sign up page
│   ├── (root)/              # Protected routes
│   │   ├── interview/       # Interview pages
│   │   │   └── [id]/        # Dynamic interview routes
│   │   └── page.tsx         # Dashboard
│   ├── api/                 # API routes
│   │   └── vapi/            # Vapi integration
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # UI components (buttons, forms, etc.)
│   ├── Agent.tsx            # AI interviewer component
│   ├── AuthForm.tsx         # Authentication form
│   ├── InterviewCard.tsx    # Interview card component
│   └── LogoutButton.tsx     # Logout button component
├── lib/                     # Utility functions
│   ├── actions/             # Server actions
│   │   ├── auth.action.ts   # Authentication actions
│   │   └── general.action.ts # General actions
│   ├── utils.ts             # Utility functions
│   └── vapi.sdk.ts          # Vapi SDK integration
├── firebase/                # Firebase configuration
│   ├── admin.ts             # Firebase Admin SDK
│   └── client.ts            # Firebase Client SDK
├── types/                   # TypeScript type definitions
│   ├── index.d.ts           # Global types
│   └── vapi.d.ts            # Vapi types
├── constants/               # Application constants
│   └── index.ts             # Constants and schemas
└── public/                  # Static assets
```

## 🎯 Key Features Explained

### Authentication Flow
1. Users sign up with email and password
2. Firebase creates user account
3. Session cookie is set for authentication
4. Protected routes check authentication status
5. Users can securely logout

### Interview Generation Flow
1. User initiates interview generation
2. AI agent asks about role, level, and tech stack
3. System generates customized interview questions
4. Interview is saved to Firestore
5. User can start the interview

### Interview Execution Flow
1. User starts voice call with AI interviewer
2. Real-time transcription of conversation
3. AI asks prepared questions
4. User responds via voice
5. Conversation is recorded and transcribed

### Feedback Generation Flow
1. Interview ends and transcript is saved
2. Google Gemini AI analyzes the transcript
3. Structured feedback is generated
4. Scores and recommendations are saved
5. User can view detailed feedback

## 🔒 Security Features

- Server-side authentication with Firebase Admin SDK
- HttpOnly session cookies
- Secure cookie flags in production
- Server actions for sensitive operations
- Input validation with Zod schemas
- Protected routes with middleware

## 🎨 UI Components

### Custom Components
- **LogoutButton**: Configurable logout button with loading states
- **Agent**: AI interviewer interface with voice interaction
- **InterviewCard**: Display interview information
- **AuthForm**: Unified authentication form for sign-in/sign-up
- **FormField**: Reusable form field component

### UI Library Components
- Button (multiple variants)
- Form controls (input, label)
- Toast notifications

## 📊 Database Schema

### Users Collection
```typescript
{
  id: string
  name: string
  email: string
}
```

### Interviews Collection
```typescript
{
  id: string
  userId: string
  role: string
  level: string
  type: string
  techstack: string[]
  questions: string[]
  finalized: boolean
  createdAt: string
}
```

### Feedback Collection
```typescript
{
  id: string
  interviewId: string
  userId: string
  totalScore: number
  categoryScores: Array<{
    name: string
    score: number
    comment: string
  }>
  strengths: string[]
  areasForImprovement: string[]
  finalAssessment: string
  createdAt: string
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Google AI](https://ai.google.dev/) - AI capabilities
- [Vapi AI](https://vapi.ai/) - Voice AI platform
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

For support, please contact the development team or open an issue in the repository.

## 🔄 Recent Updates

### Latest Features
- ✅ Logout button with secure session management
- ✅ Toast notifications for user feedback
- ✅ Improved navigation layout
- ✅ Enhanced accessibility features

---

Built with ❤️ using Next.js and AI
