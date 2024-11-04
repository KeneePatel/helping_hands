"use client";

import { useContext, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getProfileData } from "../../../Auth/AuthService";
import { AuthContext } from "../../../Auth/AuthContext";
import { useRouter } from "next/navigation";

interface DecodedToken {
  firstName?: string;
  lastName?: string;
  gymName?: string;
  type?: string;
  id?: string;
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const context = useContext(AuthContext);
  const [profileData, setProfileData] = useState<DecodedToken | null>(null);
  const userProfile = getProfileData();
  const { signout } = context;
  const router = useRouter();

  useEffect(() => {
    if (userProfile) {
      try {
        // @ts-ignore
        setProfileData(userProfile);
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader className="my-4">
          <SheetTitle className="text-left">Go To</SheetTitle>
        </SheetHeader>
        <div className={cn("flex flex-col w-full my-4")}>
          <Link href={`/profile/${profileData?.id}`} prefetch={false}>
            <Button variant="ghost" className="w-full">
              Profile
            </Button>
          </Link>
          <Link href={"/item"} prefetch={false}>
            <Button variant="ghost" className="w-full">
              Add Item
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="ghost" className="w-full">
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
