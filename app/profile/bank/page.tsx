"use client";
import React from "react";
import Link from "next/link";

interface AccountDetails {
  country: string;
  default_currency: string;
}
interface BankDetails {
  account_holder_name: string;
  bank_name: string;
  id: string;
  last4: string;
}
interface AccountBankDetails {
  bankDetails: BankDetails[];
  accountDetails: AccountDetails;
  onBoardingLink: string;
}
export default function Page() {
  const [loading, setLoading] = React.useState(true);
  const [errorApi, setErrorMessage] = React.useState<string>("");
  const [bankDetails, setBankDetails] = React.useState<AccountBankDetails>({
    bankDetails: [],
    accountDetails: { country: "", default_currency: "" },
    onBoardingLink: "",
  });
  const saveBank = (formData: FormData) => {
    const account_number: string = formData.get("account_number") as string;
    const routing_number: string = formData.get("routing_number") as string;
    const account_holder_name: string = formData.get(
      "account_holder_name",
    ) as string;
    const account_holder_type: string = formData.get(
      "account_holder_type",
    ) as string;
    const country: string = bankDetails.accountDetails.country;
    const currency: string = bankDetails.accountDetails.default_currency;
    fetch("/api/stripe/account/bank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_number: account_number,
        routing_number: routing_number,
        account_holder_name: account_holder_name,
        account_holder_type: account_holder_type,
        country: country,
        currency: currency,
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

    return;
  };
  React.useEffect(() => {
    if (!loading) return;

    fetch("/api/stripe/account/retrieve", {
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
            {bankDetails.onBoardingLink !== "" ? (
              <>
                <h2>Complete on boarding</h2>
                <Link href={bankDetails.onBoardingLink}>
                  Click here to complete your on boarding
                </Link>
              </>
            ) : (
              <>
                <h3>Bank details</h3>
                {errorApi && <h4>{errorApi}</h4>}
                {bankDetails.bankDetails.length === 0 ? (
                  <form
                    className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground profile-form"
                    action={saveBank}
                  >
                    <label className="text-md" htmlFor="account_number">
                      Account Number
                    </label>
                    <input
                      className="rounded-md px-4 py-2 bg-inherit border mb-6"
                      name="account_number"
                      placeholder="Account Number"
                      required={true}
                    />
                    <label className="text-md" htmlFor="routing_number">
                      Routing Number
                      <p className={"text-xs"}>
                        The routing number, sort code, or other
                        country-appropriate institution number for the bank
                        account. For US bank accounts, this is required and
                        should be the ACH routing number, not the wire routing
                        number. <br />
                        <b>
                          {" "}
                          If you are providing an IBAN for Account Number,{" "}
                          <u>this field is not required</u>.
                        </b>
                      </p>
                    </label>
                    <input
                      className="rounded-md px-4 py-2 bg-inherit border mb-6"
                      name="routing_number"
                      placeholder="Routing Number"
                    />
                    <label className="text-md" htmlFor="account_holder_name">
                      Account Holder Name
                    </label>
                    <input
                      className="rounded-md px-4 py-2 bg-inherit border mb-6"
                      name="account_holder_name"
                      placeholder="Account Holder Name"
                      required={true}
                    />
                    <label className="text-md" htmlFor="account_holder_type">
                      Account Holder Type
                      <p className={"text-xs"}>
                        The type of entity that holds the account. This can be
                        either individual or company.
                      </p>
                    </label>
                    <select
                      className="rounded-md px-4 py-2 bg-inherit border mb-6"
                      name="account_holder_type"
                      placeholder="Account Holder Type"
                      required={true}
                    >
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                    </select>
                    <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
                      Save
                    </button>
                  </form>
                ) : (
                  <>
                    <h4>Bank Name: {bankDetails.bankDetails[0].bank_name}</h4>
                    <h4>Last 4: {bankDetails.bankDetails[0].last4}</h4>
                    <h4>
                      Account Holder Name:{" "}
                      {bankDetails.bankDetails[0].account_holder_name}
                    </h4>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
