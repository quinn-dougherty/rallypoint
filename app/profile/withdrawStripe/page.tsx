"use client";
import React from "react";
import Link from "next/link";

interface BankDetails {
  account_holder_name: string;
  bank_name: string;
  id: string;
  last4: string;
}
export default function Page() {
  const [loading, setLoading] = React.useState(true);
  const [errorApi, setErrorMessage] = React.useState<string>("");
  const [bankDetails, setBankDetails] = React.useState<BankDetails[]>([]);

  const requestWithdraw = (formData: FormData) => {
    const amount: string = formData.get("amount") as string;
    const bank_id: string = bankDetails[0].id;
    fetch("/api/stripe/account/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount,
        bank_id: bank_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "ok") {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("");
        }
        setLoading(true);
      });
  };

  React.useEffect(() => {
    if (!loading) return;

    fetch("/api/stripe/account/bank", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "ok") {
          setErrorMessage(data.message);
        } else {
          setBankDetails(data.data);
        }
        setLoading(false);
      });
  }, [loading]);

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/profile"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        Back
      </Link>
      <div key={"form-stripe"}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h3>Withdraw</h3>
            {errorApi && <h4>{errorApi}</h4>}
            {bankDetails.length === 0 ? (
              <Link
                className={
                  "absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
                }
                href={"/profile/bank"}
              >
                Add bank details
              </Link>
            ) : (
              <>
                <form
                  action={requestWithdraw}
                  className={
                    "animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground profile-form"
                  }
                >
                  <label className={"text-md"} htmlFor={"amount"}>
                    Amount
                  </label>
                  <input
                    className={"rounded-md px-4 py-2 bg-inherit border mb-6"}
                    name={"amount"}
                    placeholder={"Amount"}
                    type={"number"}
                    required={true}
                  />
                  <button
                    className={"rounded-md px-4 py-2 bg-inherit border mb-6"}
                    type={"submit"}
                  >
                    Withdraw
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
