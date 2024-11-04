"use client";

import React, { Suspense } from "react";
import { StripeWrapper } from "@/components/payment/stripe-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "../../../Auth/ProtectedRoutes";
import { useSearchParams } from "next/navigation";
import { isUndefined } from "util";
import { getProfileData } from "../../../Auth/AuthService";

function CheckoutPageContent() {
  const searchParams = useSearchParams();

  const gymIdParam = searchParams.get("gymId");
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const chargesParam = searchParams.get("charges");
  const userIdParam = getProfileData();

  const gymId = gymIdParam ? gymIdParam : undefined;
  const startDate = startDateParam ? new Date(startDateParam) : new Date(NaN);
  const endDate = endDateParam ? new Date(endDateParam) : new Date(NaN);
  const charges = chargesParam ? Number(chargesParam) : NaN;
  const userId = userIdParam?.id ? userIdParam.id : NaN;

  const isValid =
    !isUndefined(userId) &&
    !isUndefined(gymId) &&
    !isNaN(charges) &&
    !isNaN(startDate.getTime()) &&
    !isNaN(endDate.getTime());

  if (!isValid) {
    console.log({ userId, gymId, startDate, endDate, charges });
    return <div>Some values might not be right</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Gym Membership</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-1">
                <Label>Gym ID</Label>
                <div className="text-muted-foreground">{gymId}</div>
              </div>
              <div className="grid gap-1">
                <Label>Start Date</Label>
                <div className="text-muted-foreground">
                  {new Date(startDate).toLocaleDateString()}
                </div>
              </div>
              <div className="grid gap-1">
                <Label>End Date</Label>
                <div className="text-muted-foreground">
                  {new Date(endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="grid gap-1">
                <Label>Total</Label>
                <div className="text-2xl font-bold">{`$${charges}`}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <StripeWrapper
            userId={userId}
            startDate={startDate}
            endDate={endDate}
            gymId={gymId}
            charges={charges}
          />
        </div>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>Gym Membership</div>
              <div className="font-medium">{`$${charges}`}</div>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-medium">
              <div>Total</div>
              <div>{`$${charges}`}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
