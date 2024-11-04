"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "@/components/forms/payment/checkout-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

type StripeWrapperProps = {
  userId: string;
  gymId: string;
  startDate: Date;
  endDate: Date;
  charges: number;
};

export const StripeWrapper: React.FC<StripeWrapperProps> = ({
  userId,
  gymId,
  startDate,
  endDate,
  charges,
}) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm
      userId={userId}
      gymId={gymId}
      startDate={startDate}
      endDate={endDate}
      charges={charges}
    />
  </Elements>
);
