import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getConnectionStatus } from './src/db/connect.js';
import authRoutes from './src/routes/auth.js';
import questionRoutes from './src/routes/question.js';
import answerRoutes from './src/routes/answer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/answers', answerRoutes);

// Health check route
app.get('/api/v1/health', (req, res) => {
  const dbStatus = getConnectionStatus();
  res.json({ 
    message: 'Server is running', 
    status: 'OK',
    database: dbStatus
  });
});

// Initialize server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
