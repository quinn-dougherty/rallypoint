import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
// import { ProfilesModel } from "@/types/Models";

interface ClaimResolutionParams {
  claimantStripeAccountId: string;
  posterStripeAccountId: string;
  award: number;
  post_id: string;
  claim_id: string;
}

export async function POST(req: NextRequest) {
  const {
    claimantStripeAccountId,
    posterStripeAccountId,
    award,
    post_id,
    claim_id,
  }: ClaimResolutionParams = await req.json();

  if (
    !claimantStripeAccountId ||
    !posterStripeAccountId ||
    !award ||
    !post_id ||
    !claim_id
  ) {
    return NextResponse.json({ error: "Missing required fields" });
  }
  const amount = award;
  const paymentIntent = await stripe.paymentIntents.create(
    {
      payment_method_types: ["card"],
      amount,
      currency: "usd",
      application_fee_amount: 0.01 * amount,
      transfer_data: {
        destination: claimantStripeAccountId,
      },
    },
    {
      stripeAccount: posterStripeAccountId,
    },
  );
}
