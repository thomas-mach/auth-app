<template>
  <div>
    <h2>Are you sure you want to delete your account?</h2>
    <div class="button-wrapper">
      <button class="btn" @click="hendeleDeleteAccount()">Yes</button>
      <router-link to="/dash-board" class="btn">No</router-link>
    </div>
  </div>
</template>

<script setup>
import { logout, deleteAccount } from "../api/authService.js";
import { useRouter } from "vue-router";
import { useAuthStore, useMessagesStore } from "../store/storeAuth.js";

const router = useRouter();
const authStore = useAuthStore();
const messagesStore = useMessagesStore();
const hendeleDeleteAccount = async () => {
  try {
    const response = await deleteAccount();
    await logout();
    authStore.logout();
    messagesStore.setMessage(response.message);
    router.push("/");
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.wraper {
  width: 90%;
  max-width: 1224px;
  margin: 0 auto;
}

h2 {
  margin-top: 1em;
  color: var(--clr-light-dark);
  font-size: var(--fs-h2);
  text-align: center;
  letter-spacing: 3px;
}

.button-wrapper {
  margin-top: 1em;
  display: flex;
  justify-content: center;
  gap: 2em;
}

.btn {
  text-decoration: none;
  font-size: var(--fs-body);
  color: white;
  font-weight: var(--fw-bold);
  padding: 0.75em 2em;
  border-radius: 0.5em;
  border: 1px solid var(--clr-accent);
  background-color: inherit;
  cursor: pointer;
}

@media (min-width: 768px) {
  .btn:hover {
    background-color: var(--clr-accent);
  }
}
</style>
