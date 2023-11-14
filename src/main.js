import { createApp } from "vue";
import App from "./App.vue";
import firebaseConfig from "./config/firebase";
import router from "./router";
import store from "./store";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import ClickOutsideDirective from "@/plugins/ClickOutsideDirective";
import FontAwesome from "@/plugins/FontAwesome";
import PageScrollDirective from "@/plugins/PageScrollDirective";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const forumApp = createApp(App);

forumApp.use(store);
forumApp.use(router);
forumApp.use(FontAwesome);
forumApp.use(ClickOutsideDirective);
forumApp.use(PageScrollDirective);

const requireComponent = require.context(
  "./components",
  true,
  /App[A-Z]\w+\.(vue|js)$/
);
requireComponent.keys().forEach((fileName) => {
  let baseComponentConfig = requireComponent(fileName);
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig;
  const baseComponentName =
    baseComponentConfig.name ||
    fileName.replace(/^.+\//, "").replace(/\.\w+$/, "");
  forumApp.component(baseComponentName, baseComponentConfig);
});

forumApp.mount("#app");
