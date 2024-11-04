/*
 * File: /analytics/[id]/page.tsx
 * Author: Raj Chauhan <rj513623@dal.ca>
 * Date: 2024-07-30
 * Description: Use for Gyms Owners to see analytics for their gym.
 */

"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import { StarIcon } from 'lucide-react';
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
import ProtectedRoute from "../../../../Auth/ProtectedRoutes";
import { getProfileData } from "../../../../Auth/AuthService";

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

const Analytics = () => {
  const [bookings, setBookings] = useState<number>(0);
  const [gyms, setGyms] = useState([]);

  const params = useParams();
  const router = useRouter();
  const gymId = params.id;

  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [earnings, setEarnings] = useState<number>(0);
  const [users, setUsers] = useState<User[] | null>([]);

  const user = getProfileData() as User | undefined;
  const id = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, earningsRes, usersRes, monthEarnRes, monthBookRes, getGym] =
          await Promise.all([
            fetch(process.env.NEXT_PUBLIC_API_URL + "/totalBookings/" + gymId),
            fetch(process.env.NEXT_PUBLIC_API_URL + "/totalEarnings/" + gymId),
            fetch(process.env.NEXT_PUBLIC_API_URL + "/totalBookedUsers/" + gymId),
            fetch(process.env.NEXT_PUBLIC_API_URL + "/monthlyEarnings/" + gymId),
            fetch(process.env.NEXT_PUBLIC_API_URL + "/monthlyBookings/" + gymId),
            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/gyms/" + gymId),

          ]);

        const bookingsData = await bookingsRes.json();
        const earningsData = await earningsRes.json();
        const usersData = await usersRes.json();
        const monthlyEarningData = await monthEarnRes.json();
        const monthlyBookData = await monthBookRes.json();
        const FetchGyms = await getGym.json();
        console.log(usersData);
        setGyms(FetchGyms);
        setBookings(bookingsData);
        setEarnings(earningsData);
        setUsers(usersData.users);
        setMonthlyBookings(monthlyBookData);
        setMonthlyEarnings(monthlyEarningData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const earningsChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Earnings",
        data: monthlyEarnings,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const bookingsChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Bookings",
        data: monthlyBookings,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-primary-foreground p-6 relative">
        {/* Main content container */}
        <div className="flex flex-col">
          {/* Button positioned absolutely */}
          <div className="absolute top-9 right-6">

          </div>

          {/* Header with reduced top margin */}
          <header className="text-center mt-2 mb-2">
            <h1 className="text-4xl font-bold text-secondary-foreground">
              {user?.gymName} Dashboard
            </h1>
            
            <h2 className="text-2xl mt-2 text-secondary-foreground">{gyms?.name} Overview</h2>
          </header>
          <div className="flex justify-end mb-5">

              <div >
                <Card>
                  <Link href={`/advertisements/${gymId}`} passHref>
                    <Button variant="outline" className="bg-white text-black hover:bg-gray-100"> Manage Ads </Button>
                  </Link>
                </Card>
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold">{bookings}</p>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold">${earnings}</p>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>New Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 ">
                {users == 0 ? (
                  <>
                    <p>No users have booked your gym yet</p>
                  </>
                ) : (
                  <>
                    {users?.map((user) => (
                      <div
                        key={user._id}
                        className="mb-4 hover:bg-secondary p-2 rounded-lg"
                      >
                        <p className="text-md ">
                          {user?.firstName} {user?.lastName}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="earnings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="earnings">
              <Card className="w-full mb-6">
                <CardHeader>
                  <CardTitle>Monthly Earnings</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <Line data={earningsChartData} options={chartOptions} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card className="w-full mb-6">
                <CardHeader>
                  <CardTitle>Monthly Bookings</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <Line data={bookingsChartData} options={chartOptions} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Analytics;
