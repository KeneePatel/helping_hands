"use client";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import httpFetch from "@/lib/httpFetch";
import { GET_ADVERTISEMENT } from "@/Constants/EndPoints";
import { useRouter } from "next/navigation";

export default function Advertisement() {
    const router = useRouter();
    const [ads, setAds] = useState([]);
    const [selectedAd, setSelectedAd] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                const response = await httpFetch(`${GET_ADVERTISEMENT}?page=${page}&limit=${limit}`);
                const data = await response.json();
                setAds((prevAds) => [...prevAds, ...data.advertisements]);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching advertisements:", error);
            } finally {
                setLoading(false);
            }
        };
        setLoading(true);
        fetchAdvertisements();
    }, [page]);

    const handleShowMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleCardClick = (ad) => {
        setSelectedAd(ad);
    };

    const handleVisitGym = () => {
        if (selectedAd) {
            router.push(`/itemDetails/${selectedAd.gymId}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading && (
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                )}
                {ads.map((ad) => (
                    <Dialog key={ad.id}>
                        <DialogTrigger>
                            <Card onClick={() => handleCardClick(ad)} className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                                <img
                                    src={ad.image || "/placeholder.svg"}
                                    alt="Ad Image"
                                    className="object-cover w-full h-48 rounded-t-lg"
                                />
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-bold mb-2">{ad.title}</h3>
                                    <p className="text-muted-foreground mb-4 text-sm">
                                        {ad.description.length > 50
                                            ? `${ad.description.substring(0, 50)}...`
                                            : ad.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <Button variant="primary" size="sm">
                                            Learn More
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </DialogTrigger>
                        <DialogContent>
                            <div className="space-y-4">
                                <img
                                    src={ad.image || "/placeholder.svg"}
                                    alt="Ad Image"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <h2 className="text-2xl font-bold">{ad.title}</h2>
                                <p className="text-muted-foreground">{ad.description}</p>
                                <Button size="lg" onClick={handleVisitGym}>
                                    Visit Gym
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
            {page < totalPages && (
                <Button onClick={handleShowMore} className="mt-6">
                    Load More
                </Button>
            )}

        </div>
    );
}
