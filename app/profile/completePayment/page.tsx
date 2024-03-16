"use client";
import React from "react";

export default function Page() {
  const [loading, setLoading] = React.useState(true);
  const [error, setErrorMessage] = React.useState<string>("");
  const getParams = (url: string) => {
    const params = url.split("?")[1];
    if (!params) return {};
    const paramsArray = params.split("&");
    const paramsObj: { [key: string]: string } = {};
    paramsArray.forEach((param) => {
      const [key, value] = param.split("=");
      paramsObj[key] = value;
    });
    return paramsObj;
  };

  React.useEffect(() => {
    if (!loading) return;
    fetch("/api/stripe/paymentIntent/retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: getParams(window.location.href).payment_intent,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "ok") {
          setErrorMessage(data.message);
        } else {
          console.log(data.paymentDetails);
          setErrorMessage("");
        }
        setLoading(false);
      });
  }, [loading]);

  // redirect to profile page after 5 seconds
  React.useEffect(() => {
    if (!loading && error === "") {
      setTimeout(() => {
        window.location.href = "/profile";
      }, 5000);
    }
  }, [loading, error]);
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>{error ? <h4> {error}</h4> : <h4>Deposit Successful</h4>}</div>
      )}
    </div>
  );
}
