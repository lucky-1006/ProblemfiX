import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyzeRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for local development and testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', analyzeRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "ProblemfiX AI Backend Running",
    status: "success",
    endpoints: [
      "/health",
      "/api/analyze"
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong inside the server.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` ProblemfiX AI Backend Running on port ${PORT} `);
  console.log(` Env SEARCH_PROVIDER: ${process.env.SEARCH_PROVIDER || 'tavily'} `);
  console.log(` Health check: http://localhost:${PORT}/health `);
  console.log(`=========================================`);
});
