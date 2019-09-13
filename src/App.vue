<template>
  <div id="app">
    <Main/>
  </div>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'app',
  components: {
    Main
  }
}
</script>
<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i&display=swap&subset=cyrillic')

#app
  font-size: 18px
  font-family 'Roboto Condensed', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  max-width: 240px
  width: 100vw
  margin: auto

</style>
