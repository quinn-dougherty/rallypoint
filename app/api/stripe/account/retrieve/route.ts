import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import { GetUser, GetUserStripeId } from "@/utils/userData";

export async function GET() {
  const user = await GetUser();
  try {
    const stripeID: string = await GetUserStripeId(user.id);

    const bankDetails = await stripe.accounts.listExternalAccounts(stripeID, {
      object: "bank_account",
    });
    const AccountDetails = await stripe.accounts.retrieve(stripeID);
    let onboardingLink = "";
    const currentlyDue = AccountDetails.requirements!.currently_due!;
    //remove from currently due if they exist in AccountDetails.requirements!.eventually_due
    if (
      currentlyDue.length > 0 &&
      AccountDetails.requirements!.eventually_due!.length > 0
    ) {
      AccountDetails.requirements!.eventually_due!.forEach(
        (eventuallyDue: string) => {
          const index = currentlyDue.indexOf(eventuallyDue);
          if (index > -1) {
            currentlyDue.splice(index, 1);
          }
        },
      );
    }
    if (currentlyDue.length > 0) {
      const accountLink = await stripe.accountLinks.create({
        account: stripeID,
        refresh_url: `${process.env.APP_URL}/profile/bank`,
        return_url: `${process.env.APP_URL}/profile/bank`,
        type: "account_onboarding",
        collection_options: {
          fields: "currently_due",
        },
      });
      onboardingLink = accountLink.url;
    }
    return NextResponse.json({
      status: "ok",
      data: {
        bankDetails: bankDetails.data,
        accountDetails: AccountDetails,
        onBoardingLink: onboardingLink,
      },
    });
  } catch (err) {
    return NextResponse.json({
      status: "err",
      message: String(err).split(":")[1],
    });
  }
}
