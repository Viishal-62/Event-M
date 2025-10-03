import {create} from "zustand";
import { axiosInstance } from "./AxiosSetup.js";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  // --- Signup ---
  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/api/auth/signup", data);
      set({ user: res.data.user, isAuthenticated: true });
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Signup failed",
      };
    }
  },

  // --- Login ---
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/api/auth/login", data , {
        withCredentials : true
      });
      set({ user: res.data.user, isAuthenticated: true });
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Login failed",
      };
    }
  },

  // --- Logout ---
  logout: async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      set({ user: null, isAuthenticated: false });
      return { success: true, message: "Logout successful" };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Logout failed",
      };
    }
  },

  // --- Check Auth ---
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/api/auth/check-auth");
      set({ user: res.data.user, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      set({ user: null, isAuthenticated: false });
      return { success: false };
    }
  },
}));
