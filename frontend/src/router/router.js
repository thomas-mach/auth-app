import { createRouter, createWebHistory } from "vue-router";
import Signup from "../views/Singup.vue";
import Signin from "../views/Signin.vue";
import PasswordChange from "../views/PasswordChange.vue";
import PasswordReset from "../views/PasswordReset.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/signup", component: Signup },
  { path: "/login", component: Signin },
  { path: "/password-change", component: PasswordChange },
  { path: "/password-reset", component: PasswordReset },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
