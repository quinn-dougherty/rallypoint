import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import { GetUser, GetUserStripeId } from "@/utils/userData";

type AccountHolderType = "individual" | "company";
interface StripeBankCreateParams {
  account_number: string;
  routing_number: string | undefined;
  account_holder_name: string;
  account_holder_type: AccountHolderType;
  country: string;
  currency: string;
}
export async function POST(req: NextRequest) {
  const {
    account_number,
    routing_number,
    account_holder_name,
    account_holder_type,
    country,
    currency,
  }: StripeBankCreateParams = await req.json();
  const user = await GetUser();
  try {
    const stripeID: string = await GetUserStripeId(user.id);
    const params = {
      account_number: account_number,
      routing_number: routing_number,
      account_holder_name: account_holder_name,
      account_holder_type: account_holder_type,
      country: country,
      currency: currency,
    };
    if (routing_number === "") {
      delete params.routing_number;
    }
    const externalAccount = await stripe.accounts.createExternalAccount(
      stripeID,
      {
        external_account: {
          object: "bank_account",
          ...params,
        },
      },
    );
    console.log("externalAccount", externalAccount);
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
export async function GET() {
  const user = await GetUser();
  const stripeID: string = await GetUserStripeId(user.id);
  try {
    const externalAccounts = await stripe.accounts.listExternalAccounts(
      stripeID,
      {
        limit: 3,
        object: "bank_account",
      },
    );
    return NextResponse.json({
      status: "ok",
      data: externalAccounts.data,
    });
  } catch (err) {
    return NextResponse.json({
      status: "err",
      message: String(err).split(":")[1],
    });
  }
}
export async function DELETE(req: NextRequest) {
  const { id }: { id: string } = await req.json();
  const user = await GetUser();
  const stripeID: string = await GetUserStripeId(user.id);
  const deleted = await stripe.accounts.deleteExternalAccount(stripeID, id);
  return NextResponse.json(deleted);
}
