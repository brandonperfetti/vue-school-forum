<template>
  <time :title="humanFriendlyDate">
    {{ diffForHumans }}
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
      type: [Number, Object],
      required: true,
    },
  },
  computed: {
    normalizedTimestamp() {
      return this.timestamp?.seconds || this.timestamp;
    },
    diffForHumans() {
      return dayjs.unix(this.normalizedTimestamp).fromNow();
    },
    humanFriendlyDate() {
      return dayjs.unix(this.normalizedTimestamp).format("llll");
    },
  },
};
</script>
