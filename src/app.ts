import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import Stripe from 'stripe';

const app: Application = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
//parsers
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://sports-facility-nu.vercel.app'],
    credentials: true,
  }),
);

// application routes
app.use('/api/', router);

app.post('/create-payment-intent', async (req: Request, res: Response) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: 'An unknown error occurred' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '👌Server is Running!',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
