export type UserType = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  bio: string;
};

export const DUMMY_USER_DATA: Array<UserType> = [
  {
    firstName: "Kenny",
    lastName: "Patel",
    userName: "kennyyy",
    email: "keneepatel@test.com",
    bio: "I'm a fitness enthusiast who loves to explore new workouts and challenge myself. Excited to be part of the FlexiGym community!",
  },
];

export const DUMMY_USER: UserType = DUMMY_USER_DATA[0];
