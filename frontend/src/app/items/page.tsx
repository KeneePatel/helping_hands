"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';
import ProtectedRoute from '../../../Auth/ProtectedRoutes';
import { GET_Item } from '@/Constants/EndPoints';

export default function GymList() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await fetch(GET_Item);
        if (!response.ok) {
          throw new Error('Failed to fetch gyms');
        }
        const data = await response.json();
        setGyms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
      <ProtectedRoute>
    <section className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 lg:p-6">
      {gyms.map((gym) => (
        <div
          key={gym._id}
          className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
        >
          <Link href={`/itemDetails/${gym._id}`} className="absolute inset-0 z-10" prefetch={false}>
            <span className="sr-only">View</span>
          </Link>
          <img src={gym.images[0]} alt={gym.name} width={400} height={300} className="object-cover w-full h-64" />
          <div className="p-4 bg-background">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{gym.name}</h3>
              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                <StarIcon className="w-4 h-4 fill-primary" />
                {(gym.ratings.totalRatings / gym.ratings.count).toFixed(1)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{gym.location.street}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-semibold">${gym.price}/month</p>
              <Button variant="outline" size="sm">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      ))}
    </section>
      </ProtectedRoute>
  );
}
