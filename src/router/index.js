import sourceData from "@/data.json";
import HomeView from "@/views/HomeView.vue";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
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
      const threadExists = sourceData.threads.find(
        (thread) => thread.id === to.params.id
      );
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
});

export default router;
