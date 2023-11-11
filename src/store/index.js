import sourceData from "@/data.json";
import { createStore } from "vuex";

export default createStore({
  state: {
    ...sourceData,
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
  },
  getters: {
    authUser: (state) => {
      const user = state.users.find((user) => user.id === state.authId);
      if (!user) return null;
      return {
        ...user,
        // authUser.posts
        get posts() {
          return state.posts.filter((post) => post.userId === user.id);
        },
        // authUser.postsCount
        get postsCount() {
          return this.posts.length;
        },
        // authUser.threads
        get threads() {
          return state.threads.filter((thread) => thread.userId === user.id);
        },
        // authUser.threadsCount
        get threadsCount() {
          return this.threads.length;
        },
      };
    },
  },
  mutations: {
    setPost(state, { post }) {
      state.posts.push(post);
    },
    setUser(state, { user, userId }) {
      const userIndex = state.users.findIndex((user) => user.id === userId);
      state.users[userIndex] = user;
    },
    apendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId);
      thread.posts.push(postId);
    },
  },
  actions: {
    createPost({ commit, state }, post) {
      post.id = "gggg" + Math.random();
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);
      commit("setPost", { post }); // set the post
      commit("apendPostToThread", {
        postId: post.id,
        threadId: post.threadId,
      }); // append post to thread
    },
    updateUser({ commit }, user) {
      commit("setUser", { user, userId: user.id });
    },
  },
  modules: {},
});
