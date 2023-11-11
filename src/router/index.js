import sourceData from "@/data.json";
import { findById } from "@/helpers/index.js";
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
    meta: { toTop: true, smoothScroll: true },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/ProfileView.vue"),
  },
  {
    path: "/me/edit",
    name: "ProfileEdit",
    props: { edit: true },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/ProfileView.vue"),
  },
  {
    path: "/category/:id",
    name: "Category",
    props: true,
    component: () =>
      import(/* webpackChunkName: "forum" */ "../views/CategoryView.vue"),
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
    component: () =>
      import(/* webpackChunkName: "thread" */ "../views/ThreadShowView.vue"),
    beforeEnter(to, from, next) {
      // check if thread exists
      const threadExists = findById(sourceData.threads, to.params.id);

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
  },
  {
    path: "/forum/:forumId/thread/create",
    name: "ThreadCreate",
    props: true,
    component: () =>
      import(/* webpackChunkName: "thread" */ "../views/ThreadCreateView.vue"),
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    props: true,
    component: () =>
      import(/* webpackChunkName: "thread" */ "../views/ThreadEditView.vue"),
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

export default router;
