// src/index.ts
import express, { Request, Response } from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to create a payment intent
app.post("/create-payment-intent", async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
