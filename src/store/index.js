import actions from "@/store/actions";
import getters from "@/store/getters";
import mutations from "@/store/mutations";
import { createStore } from "vuex";
import auth from "./modules/auth";
import categories from "./modules/categories";
import forums from "./modules/forums";
import posts from "./modules/posts";
import threads from "./modules/threads";
import users from "./modules/users";
export default createStore({
  modules: {
    categories,
    forums,
    threads,
    posts,
    users,
    auth,
  },
  state: {
    unsubscribes: [],
  },
  getters,
  actions,
  mutations,
});
