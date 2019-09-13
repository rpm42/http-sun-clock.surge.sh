<template>
  <div class="row">
    <div class="label" v-html="label"></div>
    <slot name="value"></slot>
  </div>
</template>

<script>
export default {
  name: 'Row',
  props: { label: String }
}
</script>
<style lang="stylus" scoped>
.label {
  text-align: right;
  font-size: 14px;
  flex: 0 0 35%;
  border-right: 1px solid #555;
  margin-bottom: 10px;
  padding: 10px 4px;
  font-weight: bold;
  color: #555 !important
}
.row {
  display: flex;
  flex: 1;
  flex-direction: row;
}
</style>
