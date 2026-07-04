# ProblemfiX AI

> Discover startup opportunities from real-world problems.

ProblemfiX AI is a modern, responsive, and production-ready web application designed to help founders, students, startups, and businesses identify valuable problems worth solving. The application takes an industry, niche, or topic, searches the web for real-world discussions, negative reviews, and user pain points, and processes these findings through advanced AI engines (Gemini, Groq llama, groq Deepseek R1 and OpenAI) to deliver actionable startup concepts, technical solution frameworks, opportunity scorecards, and development roadmaps.

---

## 🚀 Key Features

- **Industry Scan & Pain Point Extraction**: Combines Tavily or Google Serper APIs to scan for complaints, inefficiencies, and frustrations.
- **Opportunity Scoring**: Ranks problems from 0 to 100 based on Impact, Frequency, and AI Automation Potential.
- **Startup Ideas Generator**: Generates tailored startup ideas, target markets, value propositions, and MVP specifications.
- **Architectural Blueprints**: Maps out catchy headlines, tech stacks, API integrations, database recommendations, and 4-phase roadmaps.
- **AI Engine Abstraction**: Allows users to dynamically switch between reasoning and creative models (OpenAI GPT-5.5/GPT-4o, Groq Llama 3.3 70B, Groq DeepSeek R1, and Gemini 2.5 Flash) directly from the UI.
- **Graceful Fallbacks**: Fully operational even without active API keys by utilizing detailed simulated industry reports.
- **Ultra-Premium UI**: Linear- and Vercel-inspired dark mode theme using custom animations, glassmorphism, and responsive tables.

---

## 📁 Repository Directory Structure

```text
ProblemfiXv2/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── analyzeController.ts   # Request routing logic, query preparation
│   │   ├── interfaces/
│   │   │   ├── AIProvider.ts          # AI response types and abstract interface
│   │   │   └── SearchProvider.ts      # Web search abstract interface
│   │   ├── routes/
│   │   │   └── analyzeRoutes.ts       # Express router definition
│   │   ├── services/
│   │   │   ├── TavilySearchProvider.ts# Tavily search integration
│   │   │   ├── SerperSearchProvider.ts# Serper search integration
│   │   │   ├── OpenAIProvider.ts      # OpenAI GPT-4o client & mock generator
│   │   │   ├── GroqProvider.ts        # Groq Llama/DeepSeek client & mock generator
│   │   │   └── GeminiProvider.ts      # Gemini client & mock generator
│   │   └── index.ts                   # Express server config
│   ├── .env.example                   # Template env file
│   ├── package.json                   # Backend script scripts & dev dependencies
│   └── tsconfig.json                  # Strict TypeScript rules
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIProviderSelector.tsx # Model/Provider selection dropdown
│   │   │   ├── SearchBar.tsx          # Combined text input + suggestions trigger
│   │   │   ├── ResultTabs.tsx         # Dashboard page navigation
│   │   │   ├── ProblemCard.tsx        # Card for viewing specific pain points
│   │   │   ├── OpportunityTable.tsx   # Table for viewing metric scores
│   │   │   ├── StartupCard.tsx        # Grid card for general startup info
│   │   │   ├── SolutionCard.tsx       # Details AI solutions & tools
│   │   │   ├── BlueprintCard.tsx      # Expandable card mapping technical roadmaps
│   │   │   ├── LoadingState.tsx       # Progress steps loader timeline
│   │   │   └── EmptyState.tsx         # Suggestion cards panel
│   │   ├── App.tsx                    # State manager, views, and routing shell
│   │   ├── index.css                  # Font imports, custom scrollbar & animations
│   │   ├── main.tsx                   # React bootstrapper
│   │   └── vite-env.d.ts              # Vite typing definition
│   ├── index.html                     # Root entry markup page
│   ├── package.json                   # Frontend build configurations
│   ├── tailwind.config.js             # Styling variables & dark tokens
│   ├── postcss.config.js              # PostCSS configuration
│   └── vite.config.ts                 # React compiler settings & local proxy target
│
└── README.md                          # Documentation guide
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### Step 1: Configure Environment Variables
Copy the env template in the `backend` folder:
```bash
cd backend
cp .env.example .env
```
Open `backend/.env` and paste your API keys:
```env
OPENAI_API_KEY=your-openai-api-key
GROQ_API_KEY=your-groq-api-key
GEMINI_API_KEY=your-gemini-api-key
TAVILY_API_KEY=your-tavily-api-key
SERPER_API_KEY=your-serper-api-key
SEARCH_PROVIDER=tavily
PORT=5005
```
*(Note: If API keys are left blank, the application will automatically enter **Simulation Mode**, returning high-quality mock data so you can test the entire dashboard layout without key configurations).*

---

## 🚀 Run Instructions

You can run the frontend and backend servers concurrently using separate terminal tabs.

### Tab 1: Run the Backend Server
```bash
cd backend
npm run dev
```
The server will initialize on port **5005** with hot reloading enabled.

### Tab 2: Run the Frontend Application
```bash
cd frontend
npm run dev
```
Vite will serve the application, typically on port **5173** (or **5174** if 5173 is in use). Open the URL in your browser.

---

## 🧪 Production Bundling

To compile both backend and frontend applications for production:

### Build Backend
```bash
cd backend
npm run build
```
This compiles TypeScript files into JavaScript in the `/backend/dist` directory.

### Build Frontend
```bash
cd frontend
npm run build
```
This builds and optimizes the React application, writing static assets to `/frontend/dist`.

---

## 👨‍💻 Tech Stack Detail

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express, TypeScript, Dotenv, Axios.
- **Search Integrations**: Tavily Search, Google Serper.
- **AI Integrations**: OpenAI (GPT-4o), Groq (Llama 3.3 70B & DeepSeek R1), and Gemini (Gemini 2.5 Flash).
