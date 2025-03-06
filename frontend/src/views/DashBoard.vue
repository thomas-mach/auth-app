<template>
  <div class="wrapper">
    <h2>DASHBOARD</h2>
    <nav>
      <ul>
        <li>
          <router-link to="/dash-board/password-change" class="custom-link"
            >Change password</router-link
          >
        </li>
        <li>
          <router-link to="/dash-board/delete-account" class="custom-link"
            >Delete account</router-link
          >
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
  <p class="message" v-if="messagesStore.message && messageTime">
    {{ messagesStore.message }}
  </p>
</template>

<script setup>
import { ref } from "vue";
import { useMessagesStore } from "../store/storeAuth.js";

const messagesStore = useMessagesStore();
let messageTime = ref(true);

const setFalseAfterDelay = () => {
  setTimeout(() => {
    messageTime.value = false;
    messagesStore.setMessage("");
  }, 3500);
};

setFalseAfterDelay();
</script>

<style scoped>
.wrapper {
  width: 90%;
  max-width: 1224px;
  margin: 0 auto;
}

h2 {
  color: var(--clr-light);
  text-align: center;
  margin: 1em 0;
}

.custom-link {
  color: var(--clr-light);
  font-weight: var(--fw-bold);
}

ul {
  list-style: none;
}

.message {
  text-align: center;
  margin-top: 1em;
  font-size: var(--fs-h2);
  color: var(--clr-valid);
}

@media (min-width: 768px) {
  .custom-link:hover {
    color: var(--clr-accent);
  }
}
</style>
