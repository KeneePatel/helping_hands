/*
 * File: /gymOwnerDashboard/page.tsx
 * Author: Raj Chauhan <rj513623@dal.ca>
 * Date: 2024-07-30
 * Description: Use for Gyms Owners to see their gym.
 */

"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProtectedRoute from "../../../Auth/ProtectedRoutes";
import { getProfileData } from "../../../Auth/AuthService";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Booking {
  id: number;
  customer: string;
  session: string;
  date: string;
  time: string;
}

interface PopularClass {
  id: number;
  name: string;
  count: number;
}

interface User {
  _id: string;
  id: any;
  gymName: any;
  firstName: string;
  lastName: string;
  email: string;
}

const Dashboard = () => {
  const [bookings, setBookings] = useState<number>(0);
  const [gyms, setGyms] = useState([]);

  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [earnings, setEarnings] = useState<number>(0);
  const [users, setUsers] = useState<User[] | null>([]);

  const user = getProfileData() as User | undefined;
  const id = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          getGym,
        ] = await Promise.all([
          fetch(process.env.NEXT_PUBLIC_API_URL + "/item/?userId=" + id),
        ]);
        const FetchGyms = await getGym.json();
        setGyms(FetchGyms.items);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-primary-foreground p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary-foreground">
            Your Items
          </h1>
          {/* <h2 className="text-2xl mt-2 text-secondary-foreground">Overview</h2> */}
        </header>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {gyms.length > 0 ? (
            gyms.map((gym) => (
              <div
                key={gym._id}
                className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
              >
                <img
                  src={gym.images[0]}
                  alt={gym.name}
                  width={400}
                  height={300}
                  className="object-cover w-full h-64"
                />
                <div className="p-4 bg-background">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{gym.title}</h3>
                    {/* <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      <StarIcon className="w-4 h-4 fill-primary" />
                      {gym.ratings.count > 0 ? (gym.ratings.totalRatings / gym.ratings.count).toFixed(
                        1
                      ) : 0}
                    </div> */}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {gym.address.street}, {gym.address.city}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {/* <p className="text-lg font-semibold">${gym.price}/day</p> */}
                    <div className="flex space-x-2">
                      <Button variant="outline" asChild>
                        <Link href={`/gyms/${gym._id}`}>Edit</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/analytics/${gym._id}`} prefetch={false}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
              <div className="justify-center align-center flex-wrap font-extrabold text-3xl ">
                <p className=" font-extrabold text-3xl ">
                  No gyms found
                </p>
                <p className=" font-semibold text-sm ">
                  Add a Gym from Navbar First
                </p>
              </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
