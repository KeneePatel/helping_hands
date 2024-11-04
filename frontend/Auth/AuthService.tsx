"use client";
import {jwtDecode} from "jwt-decode";
export function setAccessToken(accessToken: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
    }
}

export function getAccessToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
}

export function getProfileData() {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            return jwtDecode(token);
        }
    }
    return null;
}

export function removeAccessToken() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
    }
}
