<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <h1 class="push-top">Welcome to the Vue.js 3 Master Class Forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import CategoryList from "@/components/CategoryList";
import asynDataStatus from "@/mixins/asyncDataStatus";
import { mapActions } from "vuex";

export default {
  components: {
    CategoryList,
  },
  mixins: [asynDataStatus],
  computed: {
    categories() {
      return this.$store.state.categories.items;
    },
  },
  methods: {
    ...mapActions("categories", ["fetchAllCategories"]),
    ...mapActions("forums", ["fetchForums"]),
  },
  async created() {
    const categories = await this.fetchAllCategories();
    const forumIds = categories.map((category) => category.forums).flat();
    this.fetchForums({ ids: forumIds });
    await this.fetchForums({ ids: forumIds });
    this.asyncDataStatus_fetched();
  },
};
</script>
