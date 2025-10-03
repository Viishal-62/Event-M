 
import { create } from "zustand";
import { axiosInstance } from "../Apicalls/AxiosSetup.js";
 

export const useEventStore = create((set) => ({
  events: [],
  currentEvent: null,
    registrationsCountByEvent: {},

  // ✅ Create Event
  createEvent: async (formData) => {
    try {
      const res = await axiosInstance.post("/api/event/create-event", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      
      return {
        success: true,
        message: res.data.message || "Event created successfully",
        data: res.data.event,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create event",
        data: null,
      };
    }
  },

  // ✅ Get All Events
  getEvents: async () => {
    try {
      const res = await axiosInstance.get("/api/event/get-events");
      set({ events: res.data.events || [] });
      return {
        success: true,
        message: res.data.message || "Events fetched successfully",
        data: res.data.events,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch events",
        data: [],
      };
    }
  },

  // ✅ Get Single Event
  getEvent: async (eventId) => {
    try {
      const res = await axiosInstance.get(`/api/event/get-event/${eventId}`);
      set({ currentEvent: res.data.event || null });

      
      return {
        success: true,
        message: res.data.message || "Event fetched successfully",
        data: res.data.event,
      };
    } catch (err) {
      console.log(err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch event",
        data: null,
      };
    }
  },

  // ✅ Edit Event
  editEvent: async (eventId, formData) => {

    console.log(eventId , formData)
    try {
      const res = await axiosInstance.put(`/api/event/edit-event/${eventId}`, formData , {
        headers : {
          "Content-Type": "multipart/form-data"
        }
      });
      return {
        success: true,
        message: res.data.message || "Event updated successfully",
        data: res.data.event,
      };
    } catch (err) {
      console.log(err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update event",
        data: null,
      };
    }
  },

  // ✅ Delete Event
  deleteEvent: async (eventId) => {
    try {
      const res = await axiosInstance.delete(`/api/event/delete-event/${eventId}`);
      return {
        success: true,
        message: res.data.message || "Event deleted successfully",
        data: null,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete event",
        data: null,
      };
    }
  },

  registerForEvent : async (eventId , data) => {
    try {
      const res = await axiosInstance.post(`/api/event/register-event/${eventId}`, data);
      console.log(res)
      return {
        success: true,
        message: res.data.message || "Event registered successfully",
        data: res.data.event,
      };
    } catch (err) {

      console.log(err?.response?.data?.message)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to register for event",
        data: null,
      };
    }
  },

   getAllRegisteredEvents: async (id) => {
    console.log(id)
    try {
      const res = await axiosInstance.get(`/api/event/all-registered-event/${id}`);

      console.log(res)
      set({ registrationsCountByEvent: res.data.registrationsCountByEvent || {} });
      return {
        success: true,
        message: res.data.message || "Registered events fetched successfully",
        data: res.data.registrationsCountByEvent,
      };
    } catch (err) {
      console.log("Error fetching registered events:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch registered events",
        data: {},
      };
    }
  },
}));
