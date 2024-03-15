import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";

interface PaymentIntentParams {
  amount: number;
}
export async function POST(req: NextRequest) {
  const { amount }: PaymentIntentParams = await req.json();
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });
    return NextResponse.json({
      status: "ok",
      client_secret: paymentIntent.client_secret,
    });
  } catch (err) {
    return NextResponse.json({
      status: "err",
      message: String(err).split(":")[1],
    });
  }
}
