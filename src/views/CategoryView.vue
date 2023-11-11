<template>
  <h1>{{ category.name }}</h1>
  <ForumList :title="category.name" :forums="getForumsForCategory(category)" />
</template>

<script>
import { findById } from "@/helpers/index.js";

import ForumList from "@/components/ForumList.vue";
export default {
  components: {
    ForumList,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    category() {
      return findById(this.$store.state.categories, this.id);
    },
  },
  methods: {
    getForumsForCategory(category) {
      return this.$store.state.forums.filter((forum) => {
        return forum.categoryId === category.id;
      });
    },
  },
};
</script>
