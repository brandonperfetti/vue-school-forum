<template>
  <div v-if="asyncDataStatus_ready" class="container col-full">
    <h1>{{ category.name }}</h1>
    <ForumList
      :title="category.name"
      :forums="getForumsForCategory(category)"
    />
  </div>
</template>

<script>
import ForumList from "@/components/ForumList";
import { findById } from "@/helpers";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import { mapActions } from "vuex";

export default {
  components: {
    ForumList,
  },
  mixins: [asyncDataStatus],

  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    category() {
      return findById(this.$store.state.categories, this.id) || {};
    },
  },
  methods: {
    ...mapActions(["fetchCategory", "fetchForums"]),
    getForumsForCategory(category) {
      return this.$store.state.forums.filter(
        (forum) => forum.categoryId === category.id
      );
    },
  },
  async created() {
    const category = await this.fetchCategory({ id: this.id });
    await this.fetchForums({ ids: category.forums });
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped></style>
