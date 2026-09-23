import dotenv from 'dotenv';

import app from './src/app.js';
import connectDatabase from './src/config/database.js';

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDatabase();

		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (error) {
		console.error('Server startup failed:', error.message);
		process.exit(1);
	}
};

startServer();
