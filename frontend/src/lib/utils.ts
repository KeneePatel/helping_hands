import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserType } from "./dummy-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNameFromUser(user: UserType) {
  return `${user.firstName} ${user.lastName}`;
}

export function getNameFromFirstAndLastName(
    firstName: string,
    lastName: string,
) {
  return `${firstName} ${lastName}`;
}

export function getInitialsFromUser(user: { firstName: string; lastName: string }) {
  return getInitialsFromFirstAndLastName(user.firstName, user.lastName);
}

export function getGymInitials(gymName: string): string {
  const words = gymName.split(' ');
  const initials = words.map(word => word.charAt(0).toUpperCase());
  return initials.join('');
}

export function getInitialsFromFirstAndLastName(
    firstName: string,
    lastName: string,
) {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}
