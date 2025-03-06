<template>
  <div class="wrapper">
    <h1>
      This is an authentication app. Please
      <router-link to="/signup" class="link">sign up</router-link>.
    </h1>
    <p class="message" v-if="messagesStore.message && messageTime">
      {{ messagesStore.message }}
    </p>
  </div>
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

h1 {
  margin-top: 2em;
  color: var(--clr-light-dark);
  font-size: var(--fs-h1);
  text-align: center;
  letter-spacing: 3px;
}

.message {
  text-align: center;
  margin-top: 1em;
  font-size: var(--fs-h2);
  color: var(--clr-valid);
}

.link {
  color: var(--clr-accent);
}
</style>
