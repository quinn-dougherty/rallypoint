import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import { GetUser, InsertUserStripeId } from "@/utils/userData";

interface StripeAccountCreateParams {
  country: string;
}
export async function POST(req: NextRequest) {
  const { country }: StripeAccountCreateParams = await req.json();
  const user = await GetUser();
  try {
    const stripeAccount = await stripe.accounts.create({
      type: "custom",
      country: country,
      email: user.email,
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    });
    await InsertUserStripeId({
      user_id: user.id,
      stripe_account_id: stripeAccount.id,
    });

    return NextResponse.json({
      status: "ok",
      stripe_account_id: stripeAccount.id,
    });
  } catch (err) {
    console.log(`err`, err);
    return NextResponse.json({
      status: "err",
      message: String(err).split(":")[1],
    });
  }
}
