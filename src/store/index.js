import sourceData from "@/data.json";
import { findById, upsert } from "@/helpers/index.js";
import { createStore } from "vuex";

export default createStore({
  state: {
    ...sourceData,
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
  },
  getters: {
    authUser: (state) => {
      const user = findById(state.users, state.authId);
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
      upsert(state.posts, post);
    },
    setThread(state, { thread }) {
      upsert(state.threads, thread);
    },
    setUser(state, { user, userId }) {
      const userIndex = state.users.findIndex((user) => user.id === userId);
      state.users[userIndex] = user;
    },
    apendPostToThread(state, { postId, threadId }) {
      const thread = findById(state.threads, threadId);
      thread.posts = thread.posts || [];
      thread.posts.push(postId);
    },
    appendThreadToForum(state, { forumId, threadId }) {
      const forum = findById(state.forums, forumId);
      forum.threads = forum.threads || [];
      forum.threads.push(threadId);
    },
    appendThreadToUser(state, { userId, threadId }) {
      const user = findById(state.users, userId);
      user.threads = user.threads || [];
      user.threads.push(threadId);
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
    async createThread({ commit, state, dispatch }, { text, title, forumId }) {
      const id = "gggg" + Math.random();
      const userId = state.authId;
      const publishedAt = Math.floor(Date.now() / 1000);
      const thread = { forumId, title, publishedAt, userId, id };
      commit("setThread", { thread }); // set the thread
      commit("appendThreadToUser", { userId, threadId: id }); // append thread to user
      commit("appendThreadToForum", { forumId, threadId: id }); // append thread to forum
      dispatch("createPost", { text, threadId: id }); // create the post
      return findById(state.threads, id);
    },
    async updateThread({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id);
      const post = findById(state.posts, thread.posts[0]);
      const newThread = { ...thread, title };
      const newPost = { ...post, text };
      commit("setThread", { thread: newThread });
      commit("setPost", { post: newPost });
      return newThread;
    },
    updateUser({ commit }, user) {
      commit("setUser", { user, userId: user.id });
    },
  },
  modules: {},
});
