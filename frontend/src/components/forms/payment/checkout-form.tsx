"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  CreateBookingRequest,
  PaymentService,
} from "@/services/payment-service";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CreditCardIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const givePaymentErrorToast = () => {
  toast({
    variant: "destructive",
    title: "Payment status",
    description: "Failed to process payment",
  });
};

const givePaymentSuccessToast = () => {
  toast({
    variant: "success",
    title: "Payment status",
    description: "Successfully processed payment",
  });
};

type CheckoutFormProps = {
  userId: string;
  gymId: string;
  startDate: Date;
  endDate: Date;
  charges: number;
};

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  userId,
  gymId,
  startDate,
  endDate,
  charges,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState<boolean>(false);
  const router = useRouter();

  const paymentService = new PaymentService();

  const handleCreateBooking = async () => {};

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const clientSecret = await paymentService.createPaymentIntent(charges);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
        },
      });

      if (result.error) {
        givePaymentErrorToast();
      }
      givePaymentSuccessToast();
      console.log({
        userId: userId,
        gymId: gymId,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        charges: charges,
      });

      const newBooking: CreateBookingRequest = {
        userId: userId,
        gymId: gymId,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        charges: charges,
      };
      paymentService.createBooking(newBooking);
      router.push("/");
    } catch (error) {
      console.error(error);
      givePaymentErrorToast();
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <CreditCardIcon />
              Payment Information
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="card-number">Card Number</Label>
            <CardNumberElement />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="expiration">Expiration</Label>
              <CardExpiryElement />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <CardCvcElement />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || processing}
          >
            {processing ? "Processing..." : "Pay"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
