import { create } from "zustand";

export const useAuth = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLogin: !!localStorage.getItem("token"),

  login: ({ token, user }) => {
    localStorage.setItem("token", token);
    set({ token, user, isLogin: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, isLogin: false });
  },
}));
