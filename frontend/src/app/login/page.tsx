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
import LoginComponennt from "@/components/login/loginComponent";

export default function LoginPage() {
  return (
    <LoginComponennt />
  );
}
