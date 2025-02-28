import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";
import { createPinia } from "pinia";
import "@fontsource/space-grotesk/300.css";
import "@fontsource/space-grotesk/700.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import {
  faEnvelope,
  faLock,
  faEyeSlash,
  faEye,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

library.add(
  faGithub,
  faLinkedin,
  faRobot,
  faEnvelope,
  faLock,
  faEyeSlash,
  faEye,
  faUser,
  faXmark
);
const app = createApp(App);

app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.mount("#app");
