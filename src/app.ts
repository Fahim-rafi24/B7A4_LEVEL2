import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import propertyRoutes from './routes/property.routes';
import landlordRoutes from './routes/landlord.routes';
import rentalRoutes from './routes/rental.routes';
import paymentRoutes from './routes/payment.routes';
import reviewRoutes from './routes/review.routes';
import categoryRoutes from './routes/category.routes';
import adminRoutes from './routes/admin.routes';
import * as paymentController from './controllers/payment.controller';
import { errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';

const app = express();

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

app.use(cors({
    // origin: env.SITE_URL,
    origin: ['https://b7-a5-level-2.vercel.app'],
    credentials: true,
}));
app.use(express.json({
    limit: env.URL_FILE_SIZE
}));
app.use(express.urlencoded({
    extended: true,
    limit: env.URL_FILE_SIZE
}));
app.use(express.static("public"));
app.use(cookieParser());




app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/categories', categoryRoutes);

// Landlord Management check it
app.use('/api/landlord', landlordRoutes);    //  PUT-> /api/landlord/properties/:id    DELETE-> /api/landlord/properties/:id



app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use(errorHandler);

export default app;