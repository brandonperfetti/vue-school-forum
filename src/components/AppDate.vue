<template>
  <time :title="humanFriendlydate()">
    {{ diffForHumans() }}
  </time>
</template>
<script>
import dayjs from "dayjs";
import localizedDate from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(localizedDate);
export default {
  props: {
    timestamp: {
      type: Number,
      required: true,
    },
  },
  methods: {
    diffForHumans() {
      return dayjs.unix(this.timestamp).fromNow();
    },
    humanFriendlydate() {
      return dayjs.unix(this.timestamp).format("llll");
    },
  },
};
</script>
