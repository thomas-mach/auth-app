<template>
  <div class="container">
    <CardForm>
      <template #title>
        <p class="title">Reset Password</p>
      </template>
      <template #message>
        <div class="message-placeholder">
          <p class="message" v-show="isError">Lorem ipsum dolor sit, amet</p>
        </div>
      </template>
      <template #form>
        <form novalidate @submit.prevent="submitForm">
          <!-- INPUT EMIAL -->
          <label for="email">Email</label>
          <div class="input-wraper">
            <input type="text" id="email" placeholder="Email Adress" />
            <font-awesome-icon class="icon" :icon="['fas', 'envelope']" />
          </div>
          <div class="error-message-placeholder">
            <p class="error-message" v-show="isError">
              Lorem ipsum dolor sit amet.
            </p>
          </div>
          <button class="btn" @click="test">SEND RESET TOKEN</button>
        </form>
      </template>
      <template #footer>
        <div class="create-acount-link-wraper">
          <router-link to="/signin" class="create-account-link"
            >Back to Login</router-link
          >
        </div>
      </template>
    </CardForm>
  </div>
</template>

<script setup>
import CardForm from "../components/CardForm.vue";
import { ref } from "vue";

const icon = ref(["fas", "lock"]);
const password = ref("");
const type = ref("password");
let isError = ref(false);

const toggleIcon = () => {
  if (password.value.length === 0) {
    icon.value = ["fas", "lock"];
    type.value = "password";
  } else {
    icon.value =
      type.value === "password" ? ["fas", "eye-slash"] : ["fas", "eye"];
  }
};

const showPassword = () => {
  if (password.value.length > 0) {
    if (type.value === "password") {
      type.value = "text";
      icon.value = ["fas", "eye"];
    } else {
      type.value = "password";
      icon.value = ["fas", "eye-slash"];
    }
  }
};

const test = () => {
  isError.value = !isError.value;
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  width: 90%;
  max-width: 1024px;
  height: 100%;
  display: grid;
  place-items: center;
  /* border: 1px solid rgb(1, 2, 7); */
}

form {
  display: flex;
  flex-direction: column;
}

label {
  letter-spacing: 1.3px;
  font-weight: var(--fw-bold);
  color: var(--clr-dark-light);
}

.input-wraper {
  display: flex;
  flex-direction: column;
  position: relative;
  /* margin-bottom: 0.35em; */
}

.icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--clr-dark-light);
}

input {
  padding: 1em 1em 1em 3em;
  border: none;
  border-radius: 0.45em;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
  color: var(--clr-dark-light);
  letter-spacing: 1.3px;
  border: 2px solid white;
}

input:focus {
  border: 2px solid var(--clr-accent);
  outline: none;
}

.password-reset-link {
  font-weight: var(--fw-bold);
  color: var(--clr-dark-light);
  align-self: flex-start;
}

.password-reset-link:hover {
  color: var(--clr-accent);
}

.btn {
  background-color: var(--clr-accent);
  border: none;
  padding: 1em;
  border-radius: 0.45em;
  font-size: var(--fs-body);
  font-weight: var(--fw-bold);
  letter-spacing: 1.2px;
  cursor: pointer;
  margin: 1em 0;
  color: white;
  border: 1px solid var(--clr-accent);
  transition: all 0.3s ease-in-out;
}

.password-reset-link:hover,
.password-reset-link:active {
  color: var(--clr-accent);
  text-decoration: underline;
}

.btn:hover,
.btn:active {
  color: var(--clr-accent);
  background-color: white;
  border: 1px solid var(--clr-accent);
}

.create-acount-link-wraper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.create-acount-link-wraper p {
  font-weight: var(--fw-bold);
  color: var(--clr-dark-light);
}

.create-account-link {
  color: var(--clr-accent);
  font-weight: var(--fw-bold);
}

.error-message {
  color: var(--clr-error);
  text-align: right;
  font-size: var(--fs-small);
  font-weight: var(--fw-bold);
}

.error-message-placeholder {
  height: var(--fs-small);
  margin: 0.4em 0 0.3em;
}

.message {
  font-size: var(--fs-body);
  /* font-weight: var(--fw-bold); */
}

.message-placeholder {
  height: var(--fs-body);
  margin: 0.5em 0 0.5em;
  color: var(--clr-error);
}

.title {
  font-size: var(--fs-h2);
}
</style>
