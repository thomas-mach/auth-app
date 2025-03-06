<template>
  <div class="container">
    <CardForm>
      <template #title>
        <p class="title">Change Password</p>
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
        <form novalidate @submit.prevent="hendleUpdatePassword">
          <!-- INPUT CURRENT PASSWORD -->
          <label for="current-password">Current Password</label>
          <div class="input-wraper">
            <font-awesome-icon
              class="icon"
              :icon="icon"
              @click="showPassword"
            />
            <input
              :class="{
                'error-input':
                  passwordCurrentInputError ||
                  errorMessage === 'Your current password is wrong',
              }"
              :type="type"
              id="current-password"
              placeholder="Enter Password"
              v-model="passwordCurrent"
              @input="toggleIcon"
            />
          </div>
          <div class="error-message-placeholder">
            <p class="error-message" v-if="passwordCurrentInputError">
              {{ passwordCurrentInputError }}
            </p>
          </div>
          <!-- INPUT NEW PASSWORD -->
          <label for="password">New Password</label>
          <div class="input-wraper">
            <font-awesome-icon
              class="icon"
              :icon="icon"
              @click="showPassword"
            />
            <input
              :class="{
                'error-input':
                  passwordNewInputError ||
                  errorMessage ===
                    'Your new password must be different from the old one',
                'valid-input':
                  passwordConfirmValidate() &&
                  errorMessage !==
                    'Your new password must be different from the old one',
              }"
              :type="type"
              id="password"
              placeholder="Enter Password"
              v-model="passwordNew"
              @input="toggleIcon"
            />
          </div>
          <div class="error-message-placeholder">
            <p
              class="error-message"
              v-if="passwordNewInputError && !passwordConfirmValidate()"
            >
              {{ passwordNewInputError }}
            </p>
          </div>

          <!-- INPUT PASSWORD CONFIRM -->
          <label for="password-confirm">Confirm New Password</label>
          <div class="input-wraper">
            <font-awesome-icon
              class="icon"
              :icon="icon"
              @click="showPassword"
            />
            <input
              :class="{
                'error-input':
                  passwordConfirmInputError ||
                  errorMessage ===
                    'Your new password must be different from the old one',
                'valid-input':
                  passwordConfirmValidate() &&
                  errorMessage !==
                    'Your new password must be different from the old one',
              }"
              :type="type"
              id="password-confirm"
              placeholder="Enter Password"
              v-model="passwordConfirm"
              @input="toggleIcon"
            />
          </div>
          <div class="error-message-placeholder">
            <p
              class="error-message"
              v-if="passwordConfirmInputError && !passwordConfirmValidate()"
            >
              {{ passwordConfirmInputError }}
            </p>
          </div>
          <button class="btn">CHANGE PASSWORD</button>
        </form>
      </template>
      <template #footer> </template>
    </CardForm>
  </div>
</template>

<script setup>
import CardForm from "../components/CardForm.vue";
import { ref } from "vue";
import { logout, updatePassword } from "../api/authService.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/storeAuth.js";

const router = useRouter();
const authStore = useAuthStore();

const icon = ref(["fas", "lock"]);
const type = ref("password");

const passwordCurrent = ref("");
const passwordNew = ref("");
const passwordConfirm = ref("");

let successMessage = ref("");
let errorMessage = ref("");

let passwordCurrentInputError = ref("");
let passwordNewInputError = ref("");
let passwordConfirmInputError = ref("");

const hendleUpdatePassword = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  inputValidate();
  try {
    const response = await updatePassword({
      password: passwordCurrent.value,
      passwordNew: passwordNew.value,
      passwordConfirm: passwordConfirm.value,
    });
    passwordCurrent.value = "";
    passwordNew.value = "";
    passwordConfirm.value = "";
    hendeleLogout();
  } catch (error) {
    errorMessage.value = error.response?.data?.message;
  }
};

const hendeleLogout = async () => {
  try {
    await logout();
    authStore.login({ isLoggedIn: false });
    router.push("/signin");
  } catch (error) {}
};

const toggleIcon = () => {
  if (
    passwordCurrent.value.length > 0 ||
    passwordNew.value.length > 0 ||
    passwordConfirm.value.length > 0
  ) {
    icon.value =
      type.value === "password" ? ["fas", "eye-slash"] : ["fas", "eye"];
  } else {
    icon.value = ["fas", "lock"];
    type.value = "password";
  }
};

const showPassword = () => {
  if (
    passwordCurrent.value.length > 0 ||
    password.New.length > 0 ||
    passwordConfirm.value.length > 0
  ) {
    if (type.value === "password") {
      type.value = "text";
      icon.value = ["fas", "eye"];
    } else {
      type.value = "password";
      icon.value = ["fas", "eye-slash"];
    }
  }
};

const inputValidate = () => {
  passwordCurrentInputError.value = "";
  passwordNewInputError.value = "";
  passwordConfirmInputError.value = "";

  let isValid = true;

  if (!passwordCurrent.value) {
    passwordCurrentInputError.value = "The current password is required";
    isValid = false;
  }

  if (!passwordNew.value) {
    passwordNewInputError.value = "The new password is required";
    isValid = false;
  } else if (passwordNew.value.length < 8) {
    passwordNewInputError.value = "Password must be at least 8 characters.";
    isValid = false;
  }

  if (!passwordConfirm.value) {
    passwordConfirmInputError.value = "The confirm password is required";
    isValid = false;
  } else if (passwordConfirm.value.length < 8) {
    passwordConfirmInputError.value = "Password must be at least 8 characters.";
    isValid = false;
  }

  return isValid;
};

const passwordConfirmValidate = () => {
  return (
    passwordConfirm.value.length >= 8 &&
    passwordConfirm.value === passwordNew.value
  );
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
