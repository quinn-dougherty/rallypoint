import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";

import { GetUser, InsertDeposit } from "@/utils/userData";
interface PaymentIntentRetrieveParams {
  id: string;
}
export async function POST(req: NextRequest) {
  const userData = await GetUser();
  const { id }: PaymentIntentRetrieveParams = await req.json();
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);

    try {
      await InsertDeposit({
        stripe_payment_id: paymentIntent.id,
        user_id: userData.id,
        status: paymentIntent.status,
        amnt: paymentIntent.amount,
      });
    } catch (err) {
      console.error(err);
    }
    return NextResponse.json({ status: "ok", paymentDetails: paymentIntent });
  } catch (err) {
    return NextResponse.json({ status: "err", message: String(err) });
  }
}
