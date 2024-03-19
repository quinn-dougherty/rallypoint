import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import {
  GetUser,
  GetUserBalance,
  GetUserStripeId,
  UpdateUserBalance,
} from "@/utils/userData";

interface StripeWithdrawParams {
  bank_id: string;
  amount: number;
}
export async function POST(req: NextRequest) {
  const { bank_id, amount }: StripeWithdrawParams = await req.json();
  const user = await GetUser();
  try {
    const stripeID: string = await GetUserStripeId(user.id);
    const balance = await GetUserBalance(user.id);
    if (balance < amount) {
      throw new Error("Insufficient funds");
    }
    const params = {
      destination: bank_id,
      amount: amount * 100,
      currency: "usd",
    };
    const payout = await stripe.payouts.create(params, {
      stripeAccount: stripeID,
    });
    if (payout.failure_message === "") {
      await UpdateUserBalance({ user_id: user.id, balance: balance - amount });
    } else {
      throw new Error(payout.failure_message!);
    }
    return NextResponse.json({
      status: "ok",
    });
  } catch (err) {
    return NextResponse.json({
      status: "err",
      message: String(err).split(":")[1],
    });
  }
}
