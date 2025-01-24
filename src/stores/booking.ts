import { defineStore } from "pinia";

const BASE_API_URL = "https://apitest.al-ibrabmemorialschool.com.ng/api";
// const API_TOKEN = "10|HHDFMnJMeB8B0vRwOTegSzgWS3wf9xBWPP28yHqL3447ca64"
interface UserLoginDetails {
  email: string;
  password: string;
}

export const useBookingStore = defineStore("bookingStore", {
  state: () => ({
    bookings: [] as any[],
    filteredBookings: [] as any[],
    token: "",
  }),
  actions: {
    async userLogin(user: UserLoginDetails) {
      try {
        const req = await fetch(`${BASE_API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        const res = await req.json();
        this.token = res.data.token;
        localStorage.setItem("token", this.token);
        this.fetchBookings();
        return { message: "Login successful", status: "success" };
      } catch (error) {
        console.log(error);
        return { message: "Incorrect login details", status: "error" };
      }
    },
    async userLogout() {
      this.token = "";
      localStorage.clear();
    },
    async fetchBookings() {
      if (!this.token) {
        this.token = localStorage.getItem("token") as string;
        console.log(this.token);
      }
      const req = await fetch(`${BASE_API_URL}/bookings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
      console.log(req);
      const res = await req.json();
      console.log(res);
      this.bookings = res.data;
      this.filteredBookings = this.bookings;
    },
    async approveBooking(bookingId: string) {
      const req = await fetch(`${BASE_API_URL}/bookings/${bookingId}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
      console.log(req);
      const res = await req.json();
      console.log(res);
      this.fetchBookings();
    },
    filterBookings(filter: string) {
      if (filter === "all") {
        this.filteredBookings = this.bookings;
        return;
      }
      this.filteredBookings = this.bookings.filter(
        (booking) => booking.status === filter
      );
    },
  },
});
