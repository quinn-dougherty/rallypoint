"use client";
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StripeCountries } from "@/utils/stripeCountries";

export default function Page() {
  const [loading, setLoading] = React.useState(false);
  const [errorApi, setErrorMessage] = React.useState<string>("");
  const [redirectBank, setRedirectBank] = React.useState(false);
  const saveProfile = (formData: FormData) => {
    const country: string = formData.get("country") as string;

    fetch("/api/stripe/account/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: country,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "ok") {
          setErrorMessage(data.message);
        } else {
          setRedirectBank(true);
        }
        setLoading(false);
      });
    return;
  };
  React.useEffect(() => {
    if (redirectBank) {
      redirect("/profile/bank");
    }
  }, [redirectBank]);

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
            {errorApi && <h4>{errorApi}</h4>}
            <form
              className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground profile-form"
              action={saveProfile}
            >
              <label className="text-md" htmlFor="country">
                Country
                <p className={"text-xs"}>
                  Must match the country of your bank account. You cannot change
                  this later
                </p>
              </label>
              <select
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                name="country"
                placeholder="Select Country"
                required={true}
              >
                {StripeCountries.map((country) => {
                  return (
                    <option key={country.code} value={country.code}>
                      {country.country}
                    </option>
                  );
                })}
              </select>
              <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
                Save
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
