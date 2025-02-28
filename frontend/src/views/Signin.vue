<template>
  <div class="container">
    <CardForm>
      <template #title>
        <p>Sign in</p>
      </template>
      <template #message>
        <div class="message-placeholder">
          <p class="success-generic-message" v-if="successMessage">
            {{ successMessage }}
          </p>
          <p class="error-generic-message" v-if="errorMessage">
            {{ errorMessage }}
          </p>
        </div>
      </template>
      <template #form>
        <form novalidate @submit.prevent="hendelSingin">
          <!-- INPUT EMAIL -->
          <label for="email">Email</label>
          <div class="input-wraper">
            <input
              type="text"
              :class="{ 'error-input': emailInputError || errorMessage }"
              v-model="email"
              id="email"
              placeholder="Email Adress"
            />
            <font-awesome-icon class="icon" :icon="['fas', 'envelope']" />
          </div>
          <div class="error-message-placeholder">
            <p class="error-message" v-if="emailInputError">
              {{ emailInputError }}
            </p>
          </div>

          <!-- INPUT PASSWORD -->
          <label for="password">Password</label>
          <div class="input-wraper">
            <font-awesome-icon
              class="icon"
              :icon="icon"
              @click="showPassword"
            />
            <input
              :type="type"
              :class="{ 'error-input': passwordInputError || errorMessage }"
              id="password"
              placeholder="Enter Password"
              v-model="password"
              @input="toggleIcon()"
            />
          </div>
          <div class="error-message-placeholder">
            <p class="error-message" v-if="passwordInputError">
              {{ passwordInputError }}
            </p>
          </div>
          <router-link to="/password-reset" class="password-reset-link"
            >Forgot Password?</router-link
          >
          <button class="btn" @click="">SIGN IN</button>
        </form>
      </template>
      <template #footer>
        <div class="create-acount-link-wraper">
          <p>Don't Have an Account?</p>
          <router-link to="/signup" class="create-account-link"
            >Create Account</router-link
          >
        </div>
      </template>
    </CardForm>
  </div>
</template>

<script setup>
import CardForm from "../components/CardForm.vue";
import { ref } from "vue";
import { signin } from "../api/authService.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/storeAuth.js";

const authStore = useAuthStore();
const icon = ref(["fas", "lock"]);
const password = ref("");
const email = ref("");
const type = ref("password");
const router = useRouter();
let successMessage = ref("");
let errorMessage = ref("");
let errorsBackend = ref([]);
let emailInputError = ref("");
let passwordInputError = ref("");

const hendelSingin = async () => {
  errorsBackend.value = [];
  successMessage.value = "";
  errorMessage.value = "";
  emailInputError.value = "";
  emailValidate();
  passwordValidate();
  try {
    const response = await signin({
      email: email.value,
      password: password.value,
    });
    console.log("Login success:", response);
    console.log("Response", response.message);
    successMessage.value = response.message;
    email.value = "";
    password.value = "";
    router.push("/dash-board");
    authStore.login({ isLoggedIn: true, name: response.data.user.name });
    console.log("from store", authStore.user);
  } catch (error) {
    console.log(error);
    errorMessage.value = error.response.data.message;
  }
};

const toggleIcon = () => {
  if (!password.value) {
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

const emailValidate = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    emailInputError.value = "The email is required";
    return false;
  } else if (!regex.test(email.value)) {
    emailInputError.value = "Please provide a valid email address";
    return false;
  }
  emailInputError.value = "";
  return true;
};

const passwordValidate = () => {
  if (!password.value) {
    return (passwordInputError.value = "The password is required");
  }
  return (passwordInputError.value = "");
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
  margin: 0.5em 0 0.5em;
}

.message-placeholder {
  min-height: var(--fs-body);
  margin: 0.5em 0 0.5em;
  color: var(--clr-error);
}

.success-generic-message {
  font-size: var(--fs-body);
  color: var(--clr-valid);
  font-weight: var(--fw-bold);
}

.error-generic-message {
  font-size: var(--fs-body);
  color: var(--clr-error);
  font-weight: var(--fw-bold);
}

.error-input {
  border: 2px solid var(--clr-error);
}

.valid-input {
  border: 2px solid var(--clr-valid);
}

.valid-input:focus {
  border: 2px solid var(--clr-valid);
}
</style>
