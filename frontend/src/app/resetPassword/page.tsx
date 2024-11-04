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
import {RESETPW_URL} from "@/Constants/EndPoints";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {setAccessToken} from "@/Auth/AuthService";

export default function LoginPage() {
    const router = useRouter();
    const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [resetToken, setResetToken] = useState<string>('');
    const [formValidation, setFormValidation] = useState<string>('');

    //Method to validated email address
    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();

        if(!resetToken || !password || !confirmPassword) {
            setFormValidation("Please fill out all fields")
            return;
        }

        if(password !== confirmPassword){
            setFormValidation("Password and Confirm Password does not match")
            return;
        }


        if(!strongPasswordRegex.test(password)){
            setFormValidation('Password should length should have 8 characters including special character and number');
            return;
        }

        try {
            const response = await axios.put(RESETPW_URL, {
                passwordResetToken: resetToken,
                password: password
            });

            if (response.data.success) {
                toast.success('New Password is updated', {
                    autoClose: 2000,
                    position: "bottom-right"
                });
                setTimeout(() => {
                    router.push('/');
                }, 2000);

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
            console.error('Reset Password Error:', error);
        }

    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Reset Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="resetToken">Reset Token</Label>
                            <Input id="resetToken"
                                   value={resetToken}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setResetToken(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password"
                                   value={password}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password"
                                   value={confirmPassword}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}/>
                        </div>
                        <div className="flex justify-end text-sm">
                            <Link href="/forgotPassword" className="font-medium text-primary hover:text-primary/80"
                                  prefetch={false}>
                                Forgot your password?
                            </Link>
                        </div>
                        {formValidation && <div className="text-red-500 text-sm">{formValidation}</div>}
                        <Button className="w-full">Change Password</Button>
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
