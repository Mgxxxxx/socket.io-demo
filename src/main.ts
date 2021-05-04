import { createApp } from "vue";
import App from "./App.vue";
import "./index.scss";

const app = createApp(App);
app.directive("focus", (el: HTMLInputElement, binding) => {
  console.log(binding);
  if (binding.value) {
    el.focus();
  }
});
app.mount("#app");
