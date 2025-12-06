import { create } from "zustand";

export const useAuth = create((set) => {
  let initialToken = null;
  let initialUser = null;

  // Try to hydrate from localStorage once on init
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      initialToken = parsed.token || null;
      initialUser = parsed.user || null;
    } else {
      // backward compatible: if only "token" was stored before
      const legacyToken = localStorage.getItem("token");
      if (legacyToken) {
        initialToken = legacyToken;
        initialUser = null;
      }
    }
  } catch (e) {
    console.error("Failed to read auth from localStorage", e);
    initialToken = null;
    initialUser = null;
  }

  return {
    user: initialUser,
    token: initialToken,
    isLogin: !!initialToken,

    // called as: login({ token, user })
    login: ({ token, user }) => {
      try {
        localStorage.setItem(
          "auth",
          JSON.stringify({ token, user })
        );
        localStorage.setItem("token", token); // keep legacy key too
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
