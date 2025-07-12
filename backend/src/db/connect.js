import mongoose from 'mongoose';

// Connection state tracking
let isConnected = false;
let connectionRetries = 0;
const MAX_RETRIES = 5;

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
  isConnected = true;
  connectionRetries = 0;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
  isConnected = true;
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    await mongoose.connect(mongoURI);
    
    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log('Database connection test successful');
    
  } catch (error) {
    console.error('Database connection failed:', error.message);
    
    // Retry logic
    if (connectionRetries < MAX_RETRIES) {
      connectionRetries++;
      console.log(`Retrying connection... (${connectionRetries}/${MAX_RETRIES})`);
      
      // Wait 5 seconds before retrying
      setTimeout(() => {
        connectDB();
      }, 3000);
    } else {
      console.error('Max connection retries reached. Exiting...');
      process.exit(1);
    }
  }
};

// Get connection status
const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  };
};

// Close database connection
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};

export {
  connectDB,
  getConnectionStatus,
  closeDB
};

export const connection = mongoose.connection;
