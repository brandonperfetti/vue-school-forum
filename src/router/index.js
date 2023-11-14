import { findById } from "@/helpers";
import store from "@/store";
import HomeView from "@/views/HomeView.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/me",
    name: "Profile",
    meta: { toTop: true, smoothScroll: true, requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/ProfileView.vue"),
  },
  {
    path: "/me/edit",
    name: "ProfileEdit",
    props: { edit: true },
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "profile-edit" */ "../views/ProfileView.vue"),
  },
  {
    path: "/category/:id",
    name: "Category",
    props: true,
    component: () =>
      import(/* webpackChunkName: "category" */ "../views/CategoryView.vue"),
  },
  {
    path: "/forum/:id",
    name: "Forum",
    props: true,
    component: () =>
      import(/* webpackChunkName: "forum" */ "../views/ForumView.vue"),
  },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    props: true,
    async beforeEnter(to, from, next) {
      await store.dispatch("threads/fetchThread", {
        id: to.params.id,
        once: true,
      });
      // check if thread exists
      const threadExists = findById(store.state.threads.items, to.params.id);
      // if exists continue
      if (threadExists) {
        return next();
      } else {
        next({
          name: "NotFound",
          params: { pathMatch: to.path.substring(1).split("/") },
          // preserve existing query and hash
          query: to.query,
          hash: to.hash,
        });
      }
      // if doesnt exist redirect to not found
    },
    component: () =>
      import(
        /* webpackChunkName: "thread-show" */ "../views/ThreadShowView.vue"
      ),
  },
  {
    path: "/forum/:forumId/thread/create",
    name: "ThreadCreate",
    props: true,
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "thread-create" */ "../views/ThreadCreateView.vue"
      ),
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    props: true,
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "thread-edit" */ "../views/ThreadEditView.vue"
      ),
  },
  {
    path: "/register",
    name: "Register",
    meta: { requiresGuest: true },
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/RegisterView.vue"),
  },
  {
    path: "/signin",
    name: "SignIn",
    meta: { requiresGuest: true },
    component: () =>
      import(/* webpackChunkName: "signin" */ "../views/SignInView.vue"),
  },
  {
    path: "/logout",
    name: "SignOut",
    async beforeEnter(to, from) {
      await store.dispatch("auth/signOut");
      return { name: "Home" };
    },
  },
  {
    path: "/:pathMatch(.*)*", // catch all 404
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "not-found" */ "../views/NotFoundView.vue"),
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = "smooth";
    return scroll;
  },
});

router.beforeEach(async (to, from) => {
  await store.dispatch("auth/initAuthentication");
  console.log(`🚦 navigating to ${to.name} from ${from.name}`);
  store.dispatch("unsubscribeAllSnapshots");
  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: "SignIn", query: { redirectTo: to.path } };
  }
  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: "Home" };
  }
});

export default router;
