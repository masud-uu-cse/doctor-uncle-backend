import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import demoRouter from './routes/demo.route';
import symptomCheckerRouter from './routes/symptom-checker.route';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/demo', demoRouter);
app.use('/api/v1/symptom-checker', symptomCheckerRouter);
 

// Database Connection and Server Start
const startServer = async () => {
  try {
    if (!MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI is not set. Starting server without connecting to MongoDB.');
    } else {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to MongoDB successfully.');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
