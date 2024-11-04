"use client";
import { useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProtectedRoute from '../../../../Auth/ProtectedRoutes';
import { getProfileData } from "../../../../Auth/AuthService";
import httpFetch from "@/lib/httpFetch";
import { GET_Item, GET_REQUEST_FOR_USER, CREATE_REQUEST, DELETE_REQUEST } from "@/Constants/EndPoints";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function Component() {
    const params = useParams();
    const gymId = params.id;
    const user = getProfileData();
    const [itemDetails, setItemDetails] = useState(null);
    const [userRequest, setUserRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requestProcessing, setRequestProcessing] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    useEffect(() => {
        if (gymId) {
            const fetchItemDetails = async () => {
                try {
                    setLoading(true);
                    const response = await httpFetch(`${GET_Item}/${gymId}`);
                    const data = await response.json();
                    setItemDetails(data.item);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching gym details:", error);
                }
            };
            fetchItemDetails();
        }
    }, []);

    useEffect(() => {
        if (itemDetails) {
            fetchUserRequestDetails();
        }
    }, [itemDetails]);

    const fetchUserRequestDetails = async () => {
        try {
            const response = await httpFetch(`${GET_REQUEST_FOR_USER}/${itemDetails._id}/${user.id}`);
            const data = await response.json();
            setUserRequest(data.request);
        } catch (error) {
            console.error("Error fetching user request:", error);
        }
    };

    const handleDeleteItem = async () => {
        try {
            giveReviewToast("success", "Item deleted successfully!");
            setDeleteConfirmationOpen(false);
        } catch (error) {
            console.error("Error deleting item:", error);
            giveReviewToast("destructive", "Failed to delete item!");
        }
    };

    const handleCreateRequest = async (requestType: string) => {
        try {
            setRequestProcessing(true);
            const requestData = {
                requestType: requestType,
                comments: "", // Blank comments for now
                userId: user.id,
                itemId: itemDetails._id,
            };
            const response = await httpFetch(CREATE_REQUEST, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });
            if (response.ok) {
                giveReviewToast("success", `${requestType === "delivery" ? "Delivery" : "Pick Up"} request created successfully!`);
                await fetchUserRequestDetails();
            } else {
                throw new Error("Request creation failed");
            }
        } catch (error) {
            console.error("Error creating request:", error);
            giveReviewToast("destructive", "Failed to create request!");
        } finally {
            setRequestProcessing(false);
        }
    };

    const handleDeleteRequest = async () => {
        try {
            setRequestProcessing(true);
            const response = await httpFetch(`${DELETE_REQUEST}/${userRequest._id}`, { method: "DELETE" });
            if (response.ok) {
                giveReviewToast("success", "Request deleted successfully!");
                setUserRequest(null);
            } else {
                throw new Error("Request deletion failed");
            }
        } catch (error) {
            console.error("Error deleting request:", error);
            giveReviewToast("destructive", "Failed to delete request!");
        } finally {
            setRequestProcessing(false);
        }
    };

    const giveReviewToast = (variant: string, description: string) => {
        toast({
            variant: variant,
            title: "Request status",
            description: description,
        });
    };

    if (loading) {
        return <SkeletonContent />;
    }

    if (!itemDetails) {
        return <div>Item not found</div>;
    }

    const { images, title, description, address, userId } = itemDetails;

    return (
        <ProtectedRoute>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                        <Carousel className="rounded-lg overflow-hidden">
                            <CarouselContent>
                                {images.map((src, index) => (
                                    <CarouselItem key={index}>
                                        <img src={src} alt="Item Image" width={800} height={500} className="object-cover w-full h-[400px]" />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
                            <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
                        </Carousel>
                    </div>
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <p className="text-muted-foreground">{description}</p>
                        <div className="text-muted-foreground">{address.street}, {address.city}</div>

                        {user.id === userId ? (
                            <Button variant="destructive" className="w-full" onClick={() => setDeleteConfirmationOpen(true)}>
                                Delete
                            </Button>
                        ) : userRequest ? (
                            <Button variant="destructive" className="w-full" onClick={handleDeleteRequest} disabled={requestProcessing}>
                                Delete Request
                            </Button>
                        ) : (
                            <>
                                <Button className="w-full" onClick={() => handleCreateRequest("delivery")} disabled={requestProcessing}>
                                    Request Delivery
                                </Button>
                                <Button className="w-full mt-2" onClick={() => handleCreateRequest("pick up")} disabled={requestProcessing}>
                                    Request Pick Up
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <Dialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
                    <DialogContent>
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this item?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setDeleteConfirmationOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteItem}>
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </ProtectedRoute>
    );
}

function SkeletonContent() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-2 gap-8">
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <div className="space-y-6">
                    <Skeleton className="h-8 w-1/3 rounded-md" />
                    <Skeleton className="h-6 w-1/2 rounded-md" />
                    <Skeleton className="h-6 w-1/4 rounded-md" />
                    <Skeleton className="h-6 w-full rounded-md" />
                </div>
            </div>
        </div>
    );
}
 