"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ProtectedRoute from '../../../../Auth/ProtectedRoutes';
import { AuthContext } from '../../../../Auth/AuthContext';
import React, {useContext, useEffect, useState} from "react";
import {getProfileData,getAccessToken} from "../../../../Auth/AuthService";
import {getGymInitials, getInitialsFromUser} from "@/lib/utils";
import {useParams, useRouter} from 'next/navigation';
import {PROFILE_URL} from "../../../Constants/EndPoints";

interface Address {
  street?: string;
  city?: string;
  province?: string;
  country?: string;
}

interface ProfileData {
  firstName?: string;
  lastName?: string;
  gymName?: string;
  type?: string;
  email?: string;
  address?: Address;
  _id?: string;
}

interface LoggedInUser {
  firstName?: string;
  lastName?: string;
  gymName?: string;
  type?: string;
  email?: string;
  id?: string;
}

async function fetchProfileData(id: string | string[], authToken: string): Promise<ProfileData | null> {
  try {
    const response = await fetch(`${PROFILE_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    return null;
  }
}

export async function updateProfileData(
    id: string | undefined,
    data: {
      firstName?: string;
      lastName?: string;
      password: string;
      address?: Address;
      gymName?: string;
    },
    token: string
): Promise<void> {
  try {
    const response = await fetch(`${PROFILE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update profile data');
    }
  } catch (error) {
    console.error('Error updating profile data:', error);
    throw error;
  }
}

export async function deleteProfile(id: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${PROFILE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}
export default function ProfilePage() {
  const { id } = useParams();
  const context = useContext(AuthContext);
  // @ts-ignore
  const token = getAccessToken();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    gymName: '',
    address: {
      street: '',
      city: '',
      province: '',
      country: ''
    }
  });
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const userProfile = getProfileData();
  const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  const {signout} = context;
  const router = useRouter();

  useEffect(() => {
    const loadProfileData = async () => {
      if (!id) return;

      try {
        const userProfile = await getProfileData();
        if (userProfile) {
          // @ts-ignore
          setLoggedInUser(userProfile);
        }

        // @ts-ignore
        const apiData = await fetchProfileData(id, token);
        if (apiData) {
          setProfileData(apiData);
          setUpdateData(apiData);
          setNotFound(false);
        } else {
          setNotFound(true);
        }

      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, [id, token]);

  if (notFound) {
    return (
        <ProtectedRoute>
          <div className="w-full max-w-3xl mx-auto m-5">
            <div className="bg-background p-6 rounded-lg">
              <h1 className="text-xl font-bold text-red-500">Profile Not Found</h1>
              <p className="text-gray-600">The profile you are looking for does not exist.</p>
            </div>
          </div>
        </ProtectedRoute>
    );
  }

  const handleUpdate = async () => {
    if (!profileData) return;

    if (profileData.type === 'user') {
      if (!updateData.firstName || !updateData.lastName) {
        setError('First name and last name cannot be empty.');
        return;
      }
    } else if (profileData.type === 'gym') {
      if (!updateData.gymName) {
        setError('Gym name cannot be empty.');
        return;
      }
    }

    if ((newPassword || confirmPassword) && !strongPasswordRegex.test(newPassword)) {
      setError('Password should have a length of at least 8 characters, including a special character and a number');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // @ts-ignore
      const updatePayload: any = { ...updateData };

      if (newPassword) {
        updatePayload.password = newPassword;
      }

      // @ts-ignore
      await updateProfileData(profileData._id, updatePayload, token);

      setError(null);
      setProfileData({ ...profileData, ...updateData });
      setNewPassword('');
      setConfirmPassword('');
      // @ts-ignore
      const hasChanges = Object.keys(updateData).some(key => updateData[key] !== (profileData as any)[key]);

      if(hasChanges){
        setUpdateMessage('Profile has been updated');
      }
      if (newPassword) {
        setPasswordMessage('Password changed successfully.');
      }
      setTimeout(() => setPasswordMessage(null), 5000);
      setTimeout(() => setUpdateMessage(null), 5000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile.');
    }
  };

  const sleep = (ms: number) => {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  };

  const handleDelete = async () => {
    if (!profileData?._id) return;
    try {
      // @ts-ignore
      await deleteProfile(profileData._id, token);

      try {

        setDeleteMessage("Deleting Profile in 3 sec.");
        await sleep(3000);
        await signout();
        router.push('/');

      } catch (error) {
        console.error("Logout failed:", error);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('Failed to delete profile.');
    }
  };

  const displayFallback = profileData?.type === 'gym'
      ? getGymInitials(profileData.gymName || 'Gym')
      : getInitialsFromUser({
        firstName: profileData?.firstName || '',
        lastName: profileData?.lastName || ''
      });
  // @ts-ignore
  return (
      <ProtectedRoute>
        <div className="w-full max-w-3xl mx-auto m-5">
          <header className="bg-primary p-6 rounded-t-lg">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-user.jpg"/>
                <AvatarFallback>{displayFallback}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h1 className="text-2xl font-bold text-primary-foreground">{profileData?.type === 'gym' ? (profileData?.gymName):(`${profileData?.firstName || ''} ${profileData?.lastName || ''}`) }</h1>
                <p className="text-sm text-primary-foreground/80">{profileData?.type === 'gym' ? 'GYM PROFILE' : 'USER PROFILE'}</p>
              </div>
            </div>
          </header>
          <div className="bg-background p-6 rounded-b-lg space-y-6">
            {profileData?._id === loggedInUser?.id  &&  (
                <section>
                  <h2 className="text-lg font-semibold">Contact Information</h2>
                  <div className="grid gap-4 mt-2">
                    <div className="grid gap-1">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" readOnly={true} value={profileData?.email} className="bg-gray-100 border border-gray-300 text-gray-600"/>
                    </div>
                  </div>
                </section>
            )}
            <section>
              <h2 className="text-lg font-semibold">{profileData?.type === 'gym' ? 'Gym Details' : 'User Details'}</h2>
              {profileData?.type === 'gym' ? (
                  <div className="grid gap-4 mt-2">
                    <div className="grid gap-1">
                      <Label htmlFor="gymname">Gym Name</Label>
                      <Input id="gymname" type="text" value={updateData.gymName} readOnly={profileData?._id !== loggedInUser?.id}
                             className={`border border-gray-300 text-gray-600 ${
                                 profileData?._id !== loggedInUser?.id ? 'bg-gray-100' : ''
                             }`}
                             onChange={(e) => setUpdateData((prev) => ({ ...prev, gymName: e.target.value }))}/>
                    </div>
                  </div>
              ): (
                  <div className="grid gap-4 mt-2">
                    <div className="grid gap-1">
                      <Label htmlFor="firstname">First Name</Label>
                      <Input id="firstname" value={updateData.firstName} readOnly={profileData?._id !== loggedInUser?.id}
                             className={`border border-gray-300 text-gray-600 ${
                                 profileData?._id !== loggedInUser?.id ? 'bg-gray-100' : ''
                             }`}
                             onChange={(e) => setUpdateData((prev) => ({ ...prev, firstName: e.target.value }))}/>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="lastname">Last Name</Label>
                      <Input id="lastname" value={updateData.lastName} readOnly={profileData?._id !== loggedInUser?.id}
                             className={`border border-gray-300 text-gray-600 ${
                                 profileData?._id !== loggedInUser?.id ? 'bg-gray-100' : ''
                             }`}
                             onChange={(e) => setUpdateData((prev) => ({ ...prev, lastName: e.target.value }))}/>
                    </div>
                  </div>
              )}
            </section>
            {profileData?.type === 'gym' && (
                <section>
                  <h2 className="text-lg font-semibold">Location</h2>
                  <div className="grid gap-4 mt-2 grid-cols-2">
                    <div className="grid gap-1">
                      <Label htmlFor="street">Street</Label>
                      <Input id="street" value={updateData.address?.street || ''} readOnly={profileData?._id !== loggedInUser?.id}
                             className={`border border-gray-300 text-gray-600 ${
                                 profileData?._id !== loggedInUser?.id ? 'bg-gray-100' : ''
                             }`}
                             onChange={(e) =>
                                 setUpdateData((prev) => ({
                                   ...prev,
                                   address: { ...prev.address, street: e.target.value },
                                 }))
                             }/>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={updateData.address?.city || ''} readOnly={profileData?._id !== loggedInUser?.id}
                             className={`border border-gray-300 text-gray-600 ${
                                 profileData?._id !== loggedInUser?.id ? 'bg-gray-100' : ''
                             }`}
                             onChange={(e) =>
                                 setUpdateData((prev) => ({
                                   ...prev,
                                   address: { ...prev.address, city: e.target.value },
                                 }))
                             }/>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="province">Province</Label>
                      <Input id="province" value={updateData.address?.province || ''} readOnly={profileData?._id !== loggedInUser?.id}
                             className={`border border-gray-300 text-gray-600 ${
                                 profileData?._id !== loggedInUser?.id ? 'bg-gray-100' : ''
                             }`}
                             onChange={(e) =>
                                 setUpdateData((prev) => ({
                                   ...prev,
                                   address: { ...prev.address, province: e.target.value },
                                 }))
                             }/>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" value={updateData.address?.country || ''} readOnly={profileData?._id !== loggedInUser?.id}
                             className={`border border-gray-300 text-gray-600 ${
                                 profileData?._id !== loggedInUser?.id ? 'bg-gray-100' : ''
                             }`}
                             onChange={(e) =>
                                 setUpdateData((prev) => ({
                                   ...prev,
                                   address: { ...prev.address, country: e.target.value },
                                 }))
                             }/>
                    </div>
                  </div>
                </section>
            )}
            {profileData?._id === loggedInUser?.id  && (
                <section>
                  <h2 className="text-lg font-semibold">Change Password</h2>
                  <div className="grid gap-4 mt-2">
                    <div className="grid gap-1">
                      <Label htmlFor="name">New Password</Label>
                      <Input id="newPassword" type="password" value={newPassword}
                             onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="name">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" value={confirmPassword}
                             onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>
                  </div>
                </section>
            )}
            {profileData?._id !== loggedInUser?.id && (
                <p className="text-gray-600">You can view only</p>
            )}
            {updateMessage && <p className="text-green-500 mt-2">{updateMessage}</p>}
            {passwordMessage && <p className="text-green-500 mt-2">{passwordMessage}</p>}
            {error && <p className="text-red-500">{error}</p>}
            {deleteMessage && <p className="text-red-500">{deleteMessage}</p>}

            <Separator/>
            {profileData?._id === loggedInUser?.id  && (
                <div className="flex justify-end space-x-2">
                  <Button onClick={handleUpdate} className="ml-auto">Update</Button>
                  <Button onClick={handleDelete} className="bg-red-500 text-white">Delete</Button>
                </div>
            )}
          </div>
        </div>
      </ProtectedRoute>
  );
}
