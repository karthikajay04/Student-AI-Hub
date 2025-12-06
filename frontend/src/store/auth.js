import { create } from "zustand";

type User = {
  id?: number;
  name?: string | null;
  email?: string | null;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLogin: boolean;
  login: (payload: { token: string; user: User }) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => {
  // read from localStorage once on init
  let initialToken: string | null = null;
  let initialUser: User | null = null;

  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      initialToken = parsed.token || null;
      initialUser = parsed.user || null;
    } else {
      initialToken = localStorage.getItem("token") || null;
      initialUser = null;
    }
  } catch {
    initialToken = null;
    initialUser = null;
  }

  return {
    user: initialUser,
    token: initialToken,
    isLogin: !!initialToken,

    login: ({ token, user }) => {
      try {
        localStorage.setItem(
          "auth",
          JSON.stringify({ token, user })
        );
      } catch (e) {
        console.error("Failed to persist auth", e);
      }
      set({ token, user, isLogin: true });
    },

    logout: () => {
      try {
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
      } catch (e) {
        console.error("Failed to clear auth", e);
      }
      set({ token: null, user: null, isLogin: false });
    },
  };
});
