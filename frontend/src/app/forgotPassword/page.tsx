"use client";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from 'axios';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import {useRouter} from "next/navigation";
import {FORGOT_URL, LOGIN_URL} from "@/Constants/EndPoints";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {setAccessToken} from "@/Auth/AuthService";

export default function LoginPage() {
    const router = useRouter();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [email, setEmail] = useState<string>('');
    const [formValidation, setFormValidation] = useState<string>('');

    //Method to validated email address
    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();

        if(!email){
            setFormValidation('Please fill out Email Address');
            return;
        }

        if (!emailRegex.test(email)) {
            setFormValidation('Email Address format is invalid. Try Again!');
            return;
        }

        try {
            const response = await axios.post(FORGOT_URL, {
                email: email,
            });

            if (response.data.success) {
                toast.success('Password Reset Link send', {
                    autoClose: 2000,
                    position: "bottom-right"
                });
                setEmail('');
                setFormValidation('');
            } else {
                setFormValidation(response.data.message);
            }
        } catch (error) {
            console.log(error);
            // @ts-ignore
            if (error.response && error.response.data && error.response.data.error) {
                // @ts-ignore
                setFormValidation(error.response.data.error);
            } else {
                setFormValidation('An unknown error occurred.');
            }
            console.error('Forgot Password Error:', error);
        }

    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Forgot Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="adam@example.com"
                                   value={email}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
                        </div>
                        {formValidation && <div className="text-red-500 text-sm">{formValidation}</div>}
                        <div className="flex justify-end text-sm">
                            <Link href="/resetPassword" className="font-medium text-primary hover:text-primary/80"
                                  prefetch={false}>
                                Reset Password
                            </Link>
                        </div>
                        <Button className="w-full">Send Password Rest Link</Button>
                    </form>
                </CardContent>
            </Card>
            <ToastContainer
                autoClose={2000}
                position="bottom-right"
            />
        </div>
    );
}
