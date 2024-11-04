/*
 * File: bookings/page.tsx
 * Author: Jeet Jani <jeetjani@dal.ca>
 * Date: 2024-07-30
 * Description: Frontend logic for booking list.
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../Auth/ProtectedRoutes';
import { getProfileData } from '../../../Auth/AuthService';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarIcon } from "lucide-react";
import httpFetch from '@/lib/httpFetch';
import { GET_REVIEWS } from '@/Constants/EndPoints';
import { toast } from '@/components/ui/use-toast';

interface Booking {
  startDate: string;
  endDate: string;
  charges: number | string;
  _id: string;
  gymId: string;
  gym: any;
}

export default function Component() {
  const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const router = useRouter();
  const user = getProfileData();
  const [feedback, setFeedback] = useState({ rating: 0, comment: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  useEffect(() => {
  console.log("userData", user);

    const fetchBookings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/user/${user.id}`);
        const data = await response.json();

        const now = new Date();
        const current = data.items.filter((booking: Booking) => new Date(booking.endDate) > now);
        const past = data.items.filter((booking: Booking) => new Date(booking.endDate) <= now);

        setCurrentBookings(current);
        setPastBookings(past);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatLocation = (location: { street: string; city: string; country: string; coordinates: [number, number] }) => {
    return `${location.street}, ${location.city}, ${location.country}`;
  };

  const formatCharges = (charges: number | string) => {
    if (typeof charges === 'number') {
      return `$${charges.toFixed(2)}`;
    }
    return `$${charges}`;
  };
  const handleUpdate = (bookingId: string, gymId: string) => {
    router.push(`/bookingConfirmation/${gymId}/${bookingId}`);
  }

  const handleFeedbackSubmit = async () => {
    if (!selectedBooking) return;

    try {
      const response = await httpFetch(GET_REVIEWS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...feedback,
          gymid: selectedBooking.gym._id,
          username: user.firstName + " " + user.lastName,
          userid: user.id,
          updatedDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFeedback({ rating: 0, comment: "" });
        giveReviewToast("success", "The review submitted successfully!");
      } else {
        giveReviewToast("destructive", "Failed to submit review!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      giveReviewToast("destructive", "Failed to submit review!");
    }
  };

  const giveReviewToast = (variant: string, description: string) => {
    toast({
      variant: variant,
      title: "Review status",
      description: description,
    });
  };

  const handleRate = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  return (
      <ProtectedRoute>
    <div className="container mx-auto px-6 py-8 sm:px-8 lg:px-10">
      <h1 className="text-2xl font-bold mb-6">Booking History</h1>
      <div className="grid gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Current Bookings</h2>
          <div className="grid gap-6">
            {currentBookings && currentBookings.map((booking, index) => (
              <Card key={index} className="grid grid-cols-[1fr_120px] gap-6 px-4 py-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">{booking.gym.name}</h3>
                  <p className="text-muted-foreground">{formatLocation(booking.gym.location)}</p>
                  <p className="text-muted-foreground">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </p>
                  <p className="font-medium">{formatCharges(booking.charges)}</p>
                </div>
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm" onClick={()=>handleUpdate(booking._id, booking.gym._id)}>
                    Update
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Past Bookings</h2>
          <div className="grid gap-6">
            {pastBookings && pastBookings.map((booking, index) => (
              <Card key={index} className="grid grid-cols-[1fr_120px] gap-6 px-4 py-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">{booking.gym.name}</h3>
                  <p className="text-muted-foreground">{formatLocation(booking.gym.location)}</p>
                  <p className="text-muted-foreground">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </p>
                  <p className="font-medium">{formatCharges(booking.charges)}</p>
                </div>
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleRate(booking)}>
                    Rate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <h2 className="text-xl font-bold mb-4">Submit Feedback</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon
                    key={index}
                    className={`w-6 h-6 cursor-pointer ${index < feedback.rating ? "fill-primary" : "fill-muted stroke-muted-foreground"}`}
                    onClick={() => setFeedback((prev) => ({ ...prev, rating: index + 1 }))}
                  />
                ))}
              </div>
              <Label htmlFor="comment">Comment</Label>
              <Input
                id="comment"
                value={feedback.comment}
                onChange={(e) => setFeedback((prev) => ({ ...prev, comment: e.target.value }))}
              />
              <Button onClick={handleFeedbackSubmit}>Submit Feedback</Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
      </ProtectedRoute>
  );
}
