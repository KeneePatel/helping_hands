/*
 * File: advertisement/[id].tsx
 * Author: Jeet Jani <jeetjani@dal.ca>
 * Date: 2024-08-10
 * Description: Frontend logic for advertisements for gym owner side.
 */

"use client"

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { ADS, GET_ADS_BY_GYM } from "@/Constants/EndPoints";

interface Ad {
    _id: string;
    title: string;
    description: string;
    image: string;
    gymId: string;
}

export default function Component() {
    const params = useParams();
    const gymId = params.id as string;

    const [ads, setAds] = useState<Ad[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationModalProps, setConfirmationModalProps] = useState({
        title: '',
        confirmText: '',
        cancelText: '',
        onConfirm: () => { },
        variant: 'default' as 'default' | 'destructive',
    });

    const [editingAd, setEditingAd] = useState<Ad | null>(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedImage, setEditedImage] = useState("");
    const [formErrors, setFormErrors] = useState({
        title: "",
        description: "",
        image: "",
    });

    useEffect(() => {
        fetchAds();
    }, [gymId]);

    const fetchAds = async () => {
        try {
            const response = await fetch(`${GET_ADS_BY_GYM}/${gymId}`);
            if (!response.ok) throw new Error('Failed to fetch advertisements');
            const data = await response.json();
            console.log("data", data);
            setAds(data);
        } catch (error) {
            console.error('Error fetching advertisements:', error);
        }
    };

    const handleUpdate = (ad: Ad) => {
        // Reset the form errors when opening the modal for editing
        setFormErrors({ title: "", description: "", image: "" });

        setEditingAd(ad);
        setEditedTitle(ad.title);
        setEditedDescription(ad.description);
        setEditedImage(ad.image);
        setShowModal(true);
    };
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result as string;
                setEditedImage(base64String); // Store the base64 string
            };
            reader.onerror = (error) => {
                console.error('Error converting file to base64:', error);
            };
        }
    };
    

    const handleSave = () => {
        // Reset form errors
        setFormErrors({ title: "", description: "", image: "" });

        // Check for empty fields
        let hasErrors = false;
        if (!editedTitle.trim()) {
            setFormErrors(prev => ({ ...prev, title: "Title is required" }));
            hasErrors = true;
        }
        if (!editedDescription.trim()) {
            setFormErrors(prev => ({ ...prev, description: "Description is required" }));
            hasErrors = true;
        }
        if (!editedImage) {
            setFormErrors(prev => ({ ...prev, image: "Image is required" }));
            hasErrors = true;
        }

        if (hasErrors) {
            return; // Don't proceed if there are errors
        }

        if (editingAd) {
            // If editing an existing ad, show confirmation
            setConfirmationModalProps({
                title: "Do you want to save the changes?",
                confirmText: "Yes",
                cancelText: "No",
                onConfirm: handleSaveConfirm,
                variant: 'default',
            });
            setShowConfirmationModal(true);
        } else {
            // If creating a new ad, save directly without confirmation
            handleSaveConfirm();
        }
    };

    const handleSaveConfirm = async () => {
        try {
            const adData = {
                title: editedTitle,
                description: editedDescription,
                image: editedImage,
                gymId: gymId,
            };

            if (editingAd) {
                const response = await fetch(`${ADS}/${editingAd._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(adData),
                });
                if (!response.ok) throw new Error('Failed to update advertisement');
            } else {
                const response = await fetch(`${ADS}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(adData),
                });
                if (!response.ok) throw new Error('Failed to create advertisement');
            }

            setShowModal(false);
            setShowConfirmationModal(false);
            fetchAds(); // Refresh the ads list
        } catch (error) {
            console.error('Error saving advertisement:', error);
        }
    };

    const handleDelete = (ad: Ad) => {
        setConfirmationModalProps({
            title: `Are you sure you want to delete "${ad.title}"?`,
            confirmText: "Yes",
            cancelText: "No",
            onConfirm: async () => {
                try {
                    const response = await fetch(`${ADS}/${ad._id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error('Failed to delete advertisement');
                    setShowConfirmationModal(false);
                    fetchAds(); // Refresh the ads list
                } catch (error) {
                    console.error('Error deleting advertisement:', error);
                }
            },
            variant: 'destructive',
        });
        setShowConfirmationModal(true);
    };

    const handleCancel = () => {
        setConfirmationModalProps({
            title: "Do you want to discard the changes?",
            confirmText: "Yes",
            cancelText: "No",
            onConfirm: () => {
                setShowModal(false);
                setShowConfirmationModal(false);
            },
            variant: 'destructive',
        });
        setShowConfirmationModal(true);
    };

    const handleNewPost = () => {
        // Reset the form errors when opening the modal for a new post
        setFormErrors({ title: "", description: "", image: "" });

        setEditingAd(null);
        setEditedTitle("");
        setEditedDescription("");
        setEditedImage("");
        setShowModal(true);
    };

    return (
        <section className="container max-w-5xl mx-auto py-12 px-4 md:px-6">
            <div className="grid gap-6">
                <div className="flex justify-end">
                    <Button size="sm" onClick={handleNewPost}>
                        Post New Ad
                    </Button>
                </div>
                {ads.map(ad => (
                    <div key={ad._id} className="grid md:grid-cols-[150px_1fr_auto] gap-4 items-center border rounded-lg overflow-hidden">
                        <img
                            src={ad.image || "/placeholder.svg"}
                            alt="Advertisement Thumbnail"
                            width={150}
                            height={100}
                            className="w-full h-full object-cover"
                            style={{ aspectRatio: "150/100", objectFit: "cover" }}
                        />
                        <div className="py-4 px-6">
                            <h3 className="text-lg font-semibold">{ad.title}</h3>
                            <p className="text-sm text-muted-foreground">{ad.description}</p>
                        </div>
                        <div className="flex items-center gap-2 py-4 pr-4">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdate(ad)}
                            >
                                Update
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(ad)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                className="w-full"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                            {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="min-h-32"
                            />
                            {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="image">Image</Label>
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="image-upload"
                                    className="flex items-center justify-center gap-2 cursor-pointer rounded-md border border-dashed px-4 py-2 text-sm transition-colors hover:bg-muted"
                                >
                                    <UploadIcon className="h-4 w-4" />
                                    <span>{editingAd ? 'Replace Image' : 'Upload Image'}</span>
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                {editedImage && (
                                    <img
                                        src={editedImage}
                                        alt="Preview"
                                        width={100}
                                        height={100}
                                        className="rounded-md"
                                        style={{ aspectRatio: "100/100", objectFit: "cover" }}
                                    />
                                )}
                            </div>
                            {formErrors.image && <p className="text-red-500 text-sm">{formErrors.image}</p>}
                        </div>
                        <DialogFooter className="justify-end gap-2">
                            <Button variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmationModal
                isOpen={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={confirmationModalProps.onConfirm}
                title={confirmationModalProps.title}
                confirmText={confirmationModalProps.confirmText}
                cancelText={confirmationModalProps.cancelText}
                variant={confirmationModalProps.variant}
            />
        </section>
    );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}