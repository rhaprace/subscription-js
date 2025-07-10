import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import  errorMiddleware  from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

// Middleware
app.use(express.json()); // Add this to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // To parse cookies
app.use(arcjetMiddleware); // Arcjet middleware for security and rate limiting


// Routes
app.use('/v1/auth', authRouter);
app.use('/v1/users', userRouter);
app.use('/v1/subscriptions', subscriptionRouter);
app.use('/v1/workflows', workflowRouter);
// Error handling
app.use(errorMiddleware);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;