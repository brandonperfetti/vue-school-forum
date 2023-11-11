<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save="save" @cancel="cancel" />
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor.vue";
import { findById } from "@/helpers/index.js";
export default {
  components: { ThreadEditor },
  props: {
    forumId: {
      type: String,
      required: true,
    },
  },
  computed: {
    forum() {
      return findById(this.$store.state.forums, this.forumId);
    },
  },
  methods: {
    async save({ title, text }) {
      //dispatch a vuex action to save the thread
      const thread = await this.$store.dispatch("createThread", {
        title,
        text,
        forumId: this.forum.id,
      });
      this.$router.push({
        name: "ThreadShow",
        params: { id: thread.id },
      });
    },
    cancel() {
      this.$router.push({
        name: "Forum",
        params: { id: this.forum.id },
      });
    },
  },
};
</script>
