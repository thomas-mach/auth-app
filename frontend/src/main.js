import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";
import "@fontsource/space-grotesk/300.css";
import "@fontsource/space-grotesk/700.css";

const app = createApp(App);

app.use(router);

app.mount("#app");
