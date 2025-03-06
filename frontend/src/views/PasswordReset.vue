<template>
  <div class="container">
    <CardForm>
      <template #title>
        <p class="title">Set new Password</p>
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
        <form novalidate @submit.prevent="hendleResetPassword">
          <!-- INPUT PASSWORD -->
          <label for="password">New Password</label>
          <div class="input-wraper">
            <font-awesome-icon
              class="icon"
              :icon="icon"
              @click="showPassword"
            />
            <input
              :type="type"
              :class="{
                'error-input': getError('password'),
                'valid-input': passwordValidate(),
              }"
              id="password"
              placeholder="Enter Password"
              v-model="password"
              @input="toggleIcon()"
            />
          </div>
          <div class="error-message-placeholder">
            <p
              class="error-message"
              v-if="getError('password') && !passwordValidate()"
            >
              {{ getError("password") }}
            </p>
          </div>

          <!-- INPUT PASSWORD CONFIRM -->
          <label for="password-confirm">New Password Confirm</label>
          <div class="input-wraper">
            <font-awesome-icon
              class="icon"
              :icon="icon"
              @click="showPassword"
            />
            <input
              :type="type"
              :class="{
                'error-input': getError('passwordConfirm'),
                'valid-input': passwordConfirmValidate(),
              }"
              id="password-confirm"
              placeholder="Confirm Password"
              v-model="passwordConfirm"
              @input="toggleIcon()"
            />
          </div>
          <div class="error-message-placeholder">
            <p
              class="error-message"
              v-if="getError('passwordConfirm') && !passwordConfirmValidate()"
            >
              {{ getError("passwordConfirm") }}
            </p>
          </div>
          <button class="btn" type="submit">SET NEW PASSWORD</button>
        </form>
      </template>
      <template #footer>
        <div class="create-acount-link-wraper">
          <router-link to="/signin" class="create-account-link"
            >Login to Account</router-link
          >
        </div>
      </template>
    </CardForm>
  </div>
</template>

<script setup>
import CardForm from "../components/CardForm.vue";
import { ref } from "vue";
import { resetPassword } from "../api/authService.js";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const token = route.query.token;

const icon = ref(["fas", "lock"]);
const password = ref("");
const passwordConfirm = ref("");
const type = ref("password");
let successMessage = ref("");
let errorMessage = ref("");
let errorsBackend = ref([]);

const hendleResetPassword = async () => {
  errorsBackend.value = [];
  successMessage.value = "";
  errorMessage.value = "";
  try {
    const response = await resetPassword({
      token: token,
      password: password.value,
      passwordConfirm: passwordConfirm.value,
    });
    password.value = "";
    passwordConfirm.value = "";
    router.push("/signin");
  } catch (error) {
    errorMessage.value = error.response?.data?.message;
    if (error.response?.data?.errors) {
      errorsBackend.value = error.response.data.errors;
    } else {
      errorsBackend.value = [{ field: "general", message: "Error" }];
    }
  }
};

const toggleIcon = () => {
  if (password.value || passwordConfirm.value) {
    icon.value =
      type.value === "password" ? ["fas", "eye-slash"] : ["fas", "eye"];
  } else {
    icon.value = ["fas", "lock"];
    type.value = "password";
  }
};

const showPassword = () => {
  if (password.value.length > 0 || passwordConfirm.value.length > 0) {
    if (type.value === "password") {
      type.value = "text";
      icon.value = ["fas", "eye"];
    } else {
      type.value = "password";
      icon.value = ["fas", "eye-slash"];
    }
  }
};

const getError = (field) => {
  const errorObj = errorsBackend.value.find((error) => error.field === field);
  return errorObj ? errorObj.message : null;
};

const passwordValidate = () => password.value.length >= 8;
const passwordConfirmValidate = () => {
  return (
    passwordConfirm.value.length >= 8 &&
    passwordConfirm.value === password.value
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

.title {
  font-size: var(--fs-h2);
}
</style>
