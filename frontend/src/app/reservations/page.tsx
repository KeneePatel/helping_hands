"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { getProfileData } from "../../../Auth/AuthService";
import ProtectedRoute from "../../../Auth/ProtectedRoutes";

interface Reservation {
  id: string;
  bookingId: string;
  reservationDate: string;
  timeSlot: string;
  gymName: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Gym {
  _id: string;
  name: string;
  location: {
    street: string;
    city: string;
    country: string;
  };
  amenities: string[];
  title: string;
  tagline: string;
  images: string[];
  hours: string[];
  price: number;
  ratings: {
    totalRatings: number;
    count: number;
  };
  userId: string;
}

interface User {
  _id: string;
  id: any;
  bookingIds: string[];
  gymName: any;
  firstName: string;
  lastName: string;
  email: string;
}

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [users, setUsers] = useState<User[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // New state for success message

  const user = getProfileData() as User | undefined;
  const id = user?.id;

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const gymsRes = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/gyms/user/" + id);
        if (!gymsRes.ok) throw new Error("Failed to fetch gyms data.");
        const gymsData = await gymsRes.json();
        setGyms(gymsData);
      } catch (error) {
        console.error("Error fetching gyms data:", error);
        setError("Failed to load gyms data.");
        setLoading(false);
      }
    };

    fetchGyms();
  }, [id]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (gyms.length === 0) return;

      try {
        const reservationsPromises = gyms.map((gym: Gym) =>
          fetch(process.env.NEXT_PUBLIC_API_URL + "/totalBookedUsers/" + gym._id)
            .then(res => {
              if (!res.ok) throw new Error(`Failed to fetch reservations for gym ${gym._id}`);
              return res.json();
            })
            .then((data: { users: User[] }) => ({
              gymId: gym._id,
              users: data.users,
            }))
        );

        const reservationsData = await Promise.all(reservationsPromises);

        const allReservations: Reservation[] = reservationsData.flatMap(({ gymId, users }) =>
          users.map(user => ({
            id: user._id,
            bookingId: user.bookingIds[0],
            reservationDate: "",
            timeSlot: "",
            gymName: gyms.find(gym => gym._id === gymId)?.name || "Unknown Gym",
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
            }
          }))
        );

        setReservations(allReservations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations data:", error);
        setError("Failed to load reservations data.");
        setLoading(false);
      }
    };

    fetchReservations();
  }, [gyms]);

  const cancelReservation = async (bookingId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cancelbooking/${bookingId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reservation.');
      }

      // Remove the canceled reservation from the state
      setReservations(reservations.filter(reservation => reservation.bookingId !== bookingId));

      // Set success message
      setSuccessMessage('Reservation successfully canceled.');
    } catch (error) {
      console.error("Error canceling reservation:", error);
      setError("Failed to cancel reservation.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-primary-foreground p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary-foreground">
            Manage Reservations
          </h1>
          <h2 className="text-2xl mt-2 text-secondary-foreground">Overview</h2>
        </header>

        {loading ? (
          <div className="flex justify-center items-center font-extrabold text-3xl">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center font-extrabold text-3xl text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {successMessage && (
              <div className="flex justify-center items-center mb-4 p-4 bg-green-100 text-green-800 rounded-md">
                <p>{successMessage}</p>
              </div>
            )}
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <Card key={reservation.id} className="w-full">
                  <CardHeader>
                    <CardTitle>{reservation.gymName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      {reservation.user.firstName} {reservation.user.lastName}
                    </p>
                    {/* <p className="text-md">
                      <strong>Reservation Date:</strong> {reservation.reservationDate || "Not specified"}
                    </p>
                    <p className="text-md">
                      <strong>Time Slot:</strong> {reservation.timeSlot || "Not specified"}
                    </p> */}
                    <Button
                      className="mt-4 flex items-center text-red-500"
                      onClick={() => cancelReservation(reservation.bookingId)}
                    >
                      <XIcon className="w-4 h-4 mr-2" />
                      Cancel Reservation
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex justify-center items-center font-extrabold text-3xl">
                <p>No reservations found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Reservations;
