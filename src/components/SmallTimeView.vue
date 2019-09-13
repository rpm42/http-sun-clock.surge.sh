<template>
  <div class="value">
    <span class="hours">{{hoursStr}}</span>
    <span class="dots">:</span>
    <span class="minutes">{{minutesStr}}</span>
  </div>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'TimeView',
  props: { time: Date },
  computed: {
    hoursStr () {
      return format(this.time, 'H')
    },
    minutesStr () {
      return format(this.time, 'mm')
    }
  }
}
</script>
<style lang="stylus" scoped>
.value {
  display: flex;
  padding-left: 8px;
  font-size: 36px;
  line-height: 38px;
  text-align: left;
  flex: 0 1 65%;
  flex-direction: row;
}
.hours {
  text-align: right;
  flex: 1 1 42%;
}
.dots {
  text-align: center;
  flex: 1 1 16%;
}
.minutes {
  text-align: left;
  flex: 1 1 42%;
}
</style>
