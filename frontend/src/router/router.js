import { createRouter, createWebHistory } from "vue-router";
import Signup from "../views/Singup.vue";
import Signin from "../views/Signin.vue";
import PasswordChange from "../views/PasswordChange.vue";
import PasswordReset from "../views/PasswordReset.vue";
import DashBoard from "../views/DashBoard.vue";
import Home from "../views/Home.vue";
import Contact from "../views/Contact.vue";
import About from "../views/About.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/contact", component: Contact },
  { path: "/about", component: About },
  { path: "/signup", component: Signup },
  { path: "/signin", component: Signin },
  { path: "/password-change", component: PasswordChange },
  { path: "/password-reset", component: PasswordReset },
  { path: "/dash-board", component: DashBoard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
