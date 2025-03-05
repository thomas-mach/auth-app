<template>
  <div class="header">
    <router-link to="/" class="logo">auth-app</router-link>
    <div class="buttons-wraper" v-if="!isDesktop">
      <button class="nav-user-button">
        <font-awesome-icon
          class="user-icon"
          :icon="['fas', 'user']"
          @click="showUserNav = true"
        />
      </button>
      <button
        class="nav-toggle"
        :class="{ 'nav-open': showNav }"
        v-if="!showUserNav && !isDesktop"
        @click="showNav = !showNav"
      >
        <span class="hamburger"></span>
      </button>
    </div>
    <!-- NAV -->
    <transition name="slide">
      <nav class="nav" v-if="showNav || isDesktop">
        <ul class="nav__list">
          <li class="nav__item" @click="showNav = false">
            <router-link
              to="/"
              class="custom-link-nav"
              exact-active-class="active"
              >Home</router-link
            >
          </li>
          <li class="nav__item" @click="showNav = false">
            <router-link
              to="/contact"
              class="custom-link-nav"
              exact-active-class="active"
              >Contact</router-link
            >
          </li>
          <li class="nav__item" @click="showNav = false">
            <router-link
              to="/about"
              class="custom-link-nav"
              exact-active-class="active"
              >About</router-link
            >
          </li>
          <li
            v-if="isDesktop && authStore.user?.isLoggedIn"
            class="custom-link-nav"
            @click="showUserNav = false"
          >
            <router-link
              to="/dash-board"
              class="custom-link-nav"
              exact-active-class="active"
              >DashBoard</router-link
            >
          </li>
        </ul>
      </nav>
    </transition>

    <!-- NAV USER -->
    <transition name="slide">
      <nav class="nav-user" v-if="showUserNav || isDesktop">
        <button
          v-if="!isDesktop"
          class="close-button"
          @click="showUserNav = false"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
        <ul class="nav-user__list">
          <li
            v-if="!authStore.user?.isLoggedIn"
            class="nav-user__item"
            @click="showUserNav = false"
          >
            <router-link to="/signin" class="custom-link-signin"
              >Sign In</router-link
            >
          </li>
          <li
            v-if="!authStore.user?.isLoggedIn"
            class="nav-user__item"
            @click="showUserNav = false"
          >
            <router-link to="/signup" class="custom-link-signup"
              >Sign Up</router-link
            >
          </li>
          <li
            v-if="isDesktop && authStore.user?.isLoggedIn"
            class="nav-user__item"
            @click="showUserNav = false"
          >
            <p class="user-name">{{ authStore.user?.name }}</p>
          </li>
          <li v-if="authStore.user?.isLoggedIn" class="nav-user__item">
            <router-link
              to="/logout"
              class="custom-link-signup"
              @click="(showUserNav = false), hendeleLogout()"
              >Logout</router-link
            >
          </li>
          <li
            v-if="!isDesktop && authStore.user?.isLoggedIn"
            class="nav-user__item"
            @click="showUserNav = false"
          >
            <router-link to="/dash-board" class="custom-link"
              >DashBoard</router-link
            >
          </li>
        </ul>
      </nav>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { logout } from "../api/authService.js";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";
import { useAuthStore, useMessagesStore } from "../store/storeAuth.js";

const authStore = useAuthStore();
const messagesStore = useMessagesStore();
const router = useRouter();
let showNav = ref(false);
let showUserNav = ref(false);
let isDesktop = ref(window.innerWidth > 768);

const hendeleLogout = async () => {
  try {
    const response = await logout();
    authStore.login({ isLoggedIn: false });
    messagesStore.setMessage(response.message);
    router.push("/");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const updateScreenSize = () => {
  isDesktop.value = window.innerWidth > 768;
};

onMounted(() => {
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>

<style scoped>
.header {
  position: relative;
  max-width: 1224px;
  display: flex;
  align-items: center;
  padding: 1em;
  justify-content: space-between;
  /* border: 1px solid rgb(22, 64, 190); */
}

.buttons-wraper {
  display: flex;
  align-items: center;
}

.nav-user-button,
.close-button,
.nav-toggle {
  padding: 0.5em;
  background: transparent;
  border: 0;
}

.close-button {
  font-size: var(--fs-h2);
  align-self: flex-end;
  color: var(--clr-light);
  cursor: pointer;
  padding: 0.75em;
}

.nav-user,
.nav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  position: fixed;
  bottom: 0;
  top: 0;
  right: 0;
  background-color: var(--clr-dark);
}

.nav-user,
.close-button {
  z-index: 1000;
}

.nav-toggle {
  z-index: 500;
}

.nav {
  z-index: 300;
}

.nav-user__list,
.nav__list {
  list-style: none;
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 0;
  margin: 0 1em;
}

.nav__list {
  margin-top: 5em;
}

.nav-user__item,
.nav__item {
  font-size: var(--fs-body);
  margin-bottom: 0.75em;
}

.custom-link-signin,
.custom-link-signup,
.custom-link,
.custom-link-nav {
  /* text-decoration: none; */
  color: var(--clr-light);
  font-weight: var(--fw-bold);
}

.user-icon {
  font-size: var(--fs-body);
  color: var(--clr-light);
}

.logo {
  font-weight: var(--fw-bold);
  font-size: var(--fs-h3);
  color: var(--clr-light);
  cursor: pointer;
  text-decoration: none;
  padding: 0.25em;
}

.user-name {
  color: white;
  font-size: var(--fs-body);
  font-weight: var(--fw-bold);
}

/* HAMBURGER */
.hamburger {
  background: var(--clr-accent);
  width: 2em;
  height: 3px;
  border-radius: 1em;
  display: block;
  position: relative;
}

.hamburger,
.hamburger::before,
.hamburger::after {
  background: var(--clr-accent);
  width: 2em;
  height: 3px;
  border-radius: 1em;
  transition: transform 250ms ease-in-out;
}

.hamburger::before,
.hamburger::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
}

.hamburger::before {
  top: 6px;
}

.hamburger::after {
  bottom: 6px;
}

.hamburger {
  background: var(--clr-accent);
  width: 2em;
  height: 3px;
  border-radius: 1em;
  display: block;
  position: relative;
}

.hamburger,
.hamburger::before,
.hamburger::after {
  background: var(--clr-accent);
  width: 2em;
  height: 3px;
  border-radius: 1em;
  transition: transform 250ms ease-in-out;
}
.nav-open .hamburger {
  transform: rotate(0.625turn);
}
.nav-open .hamburger::before {
  transform: rotate(90deg) translateX(-6px);
}

.nav-open .hamburger::after {
  opacity: 0;
}

/* ANIMATION MENU */
.slide-enter-from {
  transform: translateX(100%);
}

.slide-enter-to {
  transform: translateX(0);
}

.slide-leave-from {
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 250ms cubic-bezier(0.5, 0, 0.5, 1);
}

@media (min-width: 768px) {
  .header {
    justify-content: space-between;
  }

  .nav-user,
  .nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: auto;
    position: static;
    /* bottom: 0;
    top: 0;
    right: 0; */
    background-color: inherit;
  }

  .nav-user__list,
  .nav__list {
    list-style: none;
    display: flex;
    align-items: center;
    height: 100%;
    flex-direction: row;
    padding: 0;
    margin: 0;
    gap: 1.5em;
  }

  .nav-user__item,
  .nav__item {
    font-size: var(--fs-body);
    margin: 0;
  }

  .custom-link-signin,
  .custom-link-signup {
    text-decoration: none;
    color: white;
    font-weight: var(--fw-bold);
    padding: 0.55em 1em;
    border-radius: 0.5em;
    border: 1px solid var(--clr-accent);
    background-color: inherit;
  }

  .custom-link-signin:hover,
  .custom-link-signup:hover {
    background-color: var(--clr-accent);
  }

  .custom-link-nav {
    text-decoration: none;
    color: white;
    font-weight: var(--fw-bold);
    text-transform: uppercase;
  }

  .custom-link-nav:hover {
    color: var(--clr-accent);
  }

  .active {
    color: var(--clr-accent);
    text-decoration: underline;
  }
}
</style>
