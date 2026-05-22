import { create } from 'zustand';

export interface User {
  id: string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  shopId: string;
  role: "admin" |"shop" | "seller";
}

type UserStore = {
  user: User;
  updateUser: (newUser: User) => void;
  resetUser: () => void;
}

const initialUser: User = {
  id: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  address: "",
  dateOfBirth: "",
  shopId: "",
  role: "admin"
};

export const useUserStore = create<UserStore>((set) => ({
  user: initialUser,
  updateUser: (newUser) => set(() => ({user: newUser})),
  resetUser: () => set(() => ({user: initialUser}))
}));
