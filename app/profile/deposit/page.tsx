"use client";
import React from "react";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkoutForm";

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY}`,
);
export default function Page() {
  const [clientSecret, setClientSecret] = React.useState("");
  const [Amount, setAmount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  React.useEffect(() => {
    if (Amount == 0) return;
    fetch("/api/stripe/paymentIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Amount * 100,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "ok") {
          setAmount(0);
          setLoading(false);
          setErrorMessage(data.message);
        } else {
          setClientSecret(data.client_secret);
          setLoading(false);
        }
      });
  }, [Amount]);

  const refAmount = React.useRef<HTMLInputElement>(null);
  const handleAmount = () => {
    setLoading(true);
    setAmount(
      refAmount.current?.value ? parseInt(refAmount.current?.value) : 0,
    );
  };

  const options = {
    // passing the client secret obtained from the server
    clientSecret: clientSecret,
  };
  if (loading) return <div>Loading...</div>;
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/profile"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        Back
      </Link>

      {Amount == 0 ? (
        <form>
          {errorMessage ? <h4>{errorMessage}</h4> : null}
          <label className={"text-md"} htmlFor={"amount"}>
            Amount
          </label>
          <input
            className={"rounded-md px-4 py-2 bg-inherit border mb-6"}
            name={"amount"}
            placeholder={"Amount"}
            required
            type={"number"}
            ref={refAmount}
          />
          <button
            className={"bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"}
            type={"submit"}
            onClick={(e) => {
              e.preventDefault();
              handleAmount();
            }}
          >
            Deposit
          </button>
        </form>
      ) : (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
