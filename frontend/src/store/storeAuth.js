import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem("user")) || null, // Recupera dallo storage
  }),
  actions: {
    login(userData) {
      this.user = userData;
      sessionStorage.setItem("user", JSON.stringify(userData)); // Salva nello storage
    },
    logout() {
      this.user = null;
      sessionStorage.removeItem("user"); // Rimuove dallo storage
    },
  },
});

export const useMessagesStore = defineStore("messages", {
  state: () => ({
    message: "",
  }),
  actions: {
    setMessage(newMessage) {
      this.message = newMessage;
    },
  },
});
