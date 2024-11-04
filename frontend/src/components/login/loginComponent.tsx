"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";
import Link from "next/link";
import axios from 'axios';
import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';
import { AuthContext } from '../../../Auth/AuthContext';
import { useRouter } from "next/navigation";
import { getProfileData } from '../../../Auth/AuthService';
import { LOGIN_URL, REGISTRATION_URL } from "@/Constants/EndPoints";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginComponennt() {
  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  const { authenticate } = useContext(AuthContext);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [gymName, setGymName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [registrationFormValidation, setRegistrationFormValidation] = useState<string>('');

  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginFormValidation, setLoginFormValidation] = useState<string>('');

  const [profileType, setProfileType] = useState<string>('user');
  const [activeTab, setActiveTab] = useState<string>('login');
  const [loading, setLoading] = useState<boolean>(false);  // Loading state

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!loginEmail) {
      setLoginFormValidation('Please fill out Email Address');
      return;
    }

    if (!emailRegex.test(loginEmail)) {
      setLoginFormValidation('Email Address format is invalid. Try Again!');
      return;
    }

    if (!loginPassword) {
      setLoginFormValidation('Please fill out Password');
      return;
    }

    setLoading(true);  // Start loading

    try {
      const response = await axios.post(LOGIN_URL, {
        email: loginEmail,
        password: loginPassword,
      });

      if (response.data.success) {
        toast.success('Login successful', {
          autoClose: 2000,
          position: "bottom-right"
        });
        authenticate(response.data.token);
        const user = getProfileData();
        if (user?.type == 'user') {
          router.push(`/item_search`);
        }
        if (user?.type == 'admin') {
          router.push(`/gymOwnerDashboard`);
        }
        setLoginFormValidation('');
      } else {
        setLoginFormValidation(response.data.message);
      }
    } catch (error) {
      // @ts-ignore
      if (error.response && error.response.data && error.response.data.error) {
        // @ts-ignore
        setLoginFormValidation(error.response.data.error);
      } else {
        setLoginFormValidation('An unknown error occurred.');
      }
      console.error('Login Error:', error);
    } finally {
      setLoading(false);  // Stop loading
    }
    clearRegistrationForm();
  };

  const registrationHandler = async (e: FormEvent) => {
    e.preventDefault();

    if ((profileType === "gym" && !gymName) || (profileType === "user" && (!firstName || !lastName)) || !email || !password || !confirmPassword) {
      setRegistrationFormValidation("Please fill out all fields")
      return;
    }

    if (password !== confirmPassword) {
      setRegistrationFormValidation("Password and Confirm Password does not match")
      return;
    }

    if (!emailRegex.test(email)) {
      setRegistrationFormValidation('Email Address format is invalid. Try Again!');
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      setRegistrationFormValidation('Password should length should have 8 characters including special character and number');
      return;
    }

    setLoading(true);  // Start loading

    try {
      const response = await axios.post(REGISTRATION_URL, {
        firstName: firstName,
        lastName: lastName,
        gymName: gymName,
        type: profileType,
        email: email,
        password: password
      });

      if (response.data.success) {
        toast.success('Registration successful', {
          autoClose: 2000,
          position: "bottom-right"
        });
        setActiveTab('login');
        setRegistrationFormValidation('');
      } else {
        setRegistrationFormValidation(response.data.message);
      }
    } catch (error) {
      // @ts-ignore
      if (error.response && error.response.data && error.response.data.error) {
        // @ts-ignore
        setRegistrationFormValidation(error.response.data.error);
      } else {
        setRegistrationFormValidation('An unknown error occurred.');
      }
      console.error('Registration Error:', error);
    } finally {
      setLoading(false);  // Stop loading
    }
    clearLoginForm();
  }

  const clearLoginForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setLoginFormValidation('');
  }
  const clearRegistrationForm = () => {
    setFirstName('');
    setLastName('');
    setGymName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRegistrationFormValidation('');
  }
  const onTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'login') {
      setLoginEmail('');
      setLoginPassword('');
      setLoginFormValidation('');
    } else if (value === 'register') {
      setProfileType('user');
      setFirstName('');
      setLastName('');
      setGymName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRegistrationFormValidation('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Tabs value={activeTab} className="w-full max-w-md" onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="w-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={loginHandler} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="adam@example.com"
                    value={loginEmail}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={loginPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)} />
                </div>
                <div className="flex justify-end text-sm">
                  <Link href="/forgotPassword" className="font-medium text-primary hover:text-primary/80" prefetch={false}>
                    Forgot your password?
                  </Link>
                </div>
                {loginFormValidation && <div className="text-red-500 text-sm">{loginFormValidation}</div>}
                <Button className="w-full" disabled={loading}>
                  {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card className="w-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={registrationHandler} className="space-y-4">
                {profileType === "user" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="gymName">Gym Name</Label>
                    <Input id="gymName" value={gymName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setGymName(e.target.value)} />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
                </div>
                {registrationFormValidation && <div className="text-red-500 text-sm">{registrationFormValidation}</div>}
                <Button className="w-full" disabled={loading}>
                  {loading ? <ClipLoader size={20} color={"#ffffff"} />: "Register"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ToastContainer />
    </div>
  );
}
