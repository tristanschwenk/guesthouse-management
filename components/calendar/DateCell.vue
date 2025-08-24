<template>
  <div
    class="date-cell w-full h-full flex items-center justify-center"
    :class="dateStatusClass"
  >
    <span>{{ dayNumber }}</span>
    <div
      v-if="showBookingInfo && booking"
      class="booking-info absolute bottom-0 left-0 right-0 text-xs p-1 truncate"
    >
      {{ booking.guestName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Booking } from "~/types";
import { DateStatus } from "~/types";

const props = defineProps<{
  date: Date;
  status: DateStatus;
  booking?: Booking;
  showBookingInfo?: boolean;
}>();

const dayNumber = computed(() => props.date.getDate());

const dateStatusClass = computed(() => {
  switch (props.status) {
    case DateStatus.OPEN:
      return "date-open";
    case DateStatus.CLOSE:
      return "date-close";
    case DateStatus.OPEN_CLOSE:
      return "date-open-close";
    case DateStatus.CLOSE_OPEN:
      return "date-close-open";
    default:
      return "";
  }
});
</script>

<style scoped>
.date-cell {
  position: relative;
  min-height: 40px;
  width: 100%;
  height: 100%;
}

.booking-info {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
}
</style>
