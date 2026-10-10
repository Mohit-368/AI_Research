import 'dotenv/config';
import app from './src/app.js';
import connectDatabase from './src/config/database.js';

const port = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await connectDatabase();
    const server = app.listen(port, () => console.log(`Server listening on port ${port}`));
    const shutdown = (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10_000).unref();
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
