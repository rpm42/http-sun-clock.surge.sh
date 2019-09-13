<template>
  <div class="time-view">
    <div v-if="loading">
      Загрузка...
    </div>
    <div v-else-if="askLocation">
      долгота: <input type="text" v-model="latitude">
      <br>
      широта: <input type="text" v-model="longitude">
      <br>
      <button @click="setLocation">SetLocation</button>
    </div>
    <div v-else>
      <div class="label">системное время</div>
      <TimeView :time="new Date()"></TimeView>
      <div class="label">византийское время</div>
      <TimeView :time="byzTime"></TimeView>
      <div class="label">солнечное время</div>
      <TimeView :time="sunTime"></TimeView>

      <div class="table">
        <div class="column">
          <Row label="Восход"><SmallTimeView slot="value" :time="sunrise"></SmallTimeView></Row>
          <Row label="1-ый час"><SmallTimeView slot="value" :time="dhour1"></SmallTimeView></Row>
          <Row label="3-ий час"><SmallTimeView slot="value" :time="dhour3"></SmallTimeView></Row>
          <Row label="Полдень / 6-ой час"><SmallTimeView slot="value" :time="dhour6"></SmallTimeView></Row>
          <Row label="9-ый час"><SmallTimeView slot="value" :time="dhour9"></SmallTimeView></Row>
        </div>
      </div>

      <div class="table">
        <div class="column">
          <Row label="Закат"><SmallTimeView slot="value" :time="sunset"></SmallTimeView></Row>
          <Row label="2-ая стража"><SmallTimeView slot="value" :time="nhour3"></SmallTimeView></Row>
          <Row label="Полночь"><SmallTimeView slot="value" :time="nhour6"></SmallTimeView></Row>
          <Row label="4-ая стража"><SmallTimeView slot="value" :time="nhour9"></SmallTimeView></Row>
        </div>
      </div>

      <div class="table">
        <div class="column">
          <Row label="Долгота дня"><SmallTimeView slot="value" :time="dayLength"></SmallTimeView></Row>
          <Row label="Долгота ночи"><SmallTimeView slot="value" :time="nightLength"></SmallTimeView></Row>
        </div>
      </div>
      
      <a class="ask-loc" @click="askLocation = true" href="#">ChangeLocation</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TimeView from './TimeView.vue'
import Row from './Row.vue'
import SmallTimeView from './SmallTimeView.vue'
import SunClock from '../lib/SunClock'
import axios from 'axios'

// const MINSK = {
//   latitude: 53.956136,
//   longitude: 27.538626
// }

// const ATHOS = {
//   lat: 40.238066,
//   lag: 24.201426
// }

async function getLocationByIp() {
  let result = null
  try {
    const res1 = await axios.get('https://api.ipify.org?format=json')
    if (res1.statusText !== 'OK') throw new Error('request ip failed')
    const res2 = await axios.get(`http://api.ipstack.com/${res1.data.ip}?access_key=c009f87616adb881fdf55a3282d702e5`)
    if (res2.statusText !== 'OK') throw new Error('request geo code failed')
    result = {
      latitude: res2.data.latitude,
      longitude: res2.data.longitude
    }
  } catch (e) {
    result = null
  }
  return result
}

export default {
  name: 'Main',
  data: () => ({
    loading: true,
    askLocation: true,
    latitude: undefined,
    longitude: undefined,
    sunClock: undefined
  }),
  async created () {
    this.loading = true
    if (localStorage.getItem('locationSaved')) {
      this.latitude = localStorage.getItem('latitude')
      this.longitude = localStorage.getItem('longitude')
      this.setLocation()
    } else {
      try {
        const loc = await getLocationByIp()
        if (loc) {
          this.latitude = loc.latitude
          this.longitude = loc.longitude
          this.setLocation()
        }
      } catch (e) {
        this.loading = false
      }
    }
    this.loading = false
  },
  computed: {
    byzTime () { return this.sunClock ? this.sunClock.byzTime : null },
    sunTime () { return this.sunClock ? this.sunClock.sunTime : null },
    sunrise () { return this.sunClock ? this.sunClock.times.sunrise: null },
    sunset ()  { return this.sunClock ? this.sunClock.times.sunset: null },
    dhour1 ()  { return this.sunClock ? this.sunClock.dayHour(1): null },
    dhour3 ()  { return this.sunClock ? this.sunClock.dayHour(3): null },
    dhour6 ()  { return this.sunClock ? this.sunClock.dayHour(6): null },
    dhour9 ()  { return this.sunClock ? this.sunClock.dayHour(9): null },
    nhour3 ()  { return this.sunClock ? this.sunClock.nightHour(3): null },
    nhour6 ()  { return this.sunClock ? this.sunClock.nightHour(6): null },
    nhour9 ()  { return this.sunClock ? this.sunClock.nightHour(9): null },
    dayLength ()    { return this.sunClock ? this.sunClock.dayLength : null },
    nightLength ()  { return this.sunClock ? this.sunClock.nightLength : null },
  },
  methods: {
    setLocation () {
      try {
        localStorage.setItem('locationSaved', true)
        localStorage.setItem('latitude', this.latitude)
        localStorage.setItem('longitude', this.longitude)
      }
      catch (e) {}
      this.askLocation = false
      const latitude = typeof this.latitude === 'string' ? parseFloat(this.latitude) : this.latitude
      const longitude = typeof this.longitude === 'string' ? parseFloat(this.longitude) : this.longitude
      this.sunClock = new SunClock({ latitude, longitude })
      
      const self = this
      setInterval(_ => {
        const latitude = typeof this.latitude === 'string' ? parseFloat(this.latitude) : this.latitude
        const longitude = typeof this.longitude === 'string' ? parseFloat(this.longitude) : this.longitude
          Vue.set(
            self,
            'sunClock',
            new SunClock({ latitude, longitude })
          )
        },
        500
      )
    }
  },
  components: {
    TimeView,
    SmallTimeView,
    Row
  }
}
</script>

<style scoped lang="stylus">
.time-view
  // background: #f2f2f2
  padding: 10px
  input
    font-size: 18px
    line-height: 27px
    width: 100%
    display: block
    box-sizing: border-box
  button
    display: block
    box-sizing: border-box
    width: 100%
    padding: 20px
    text-align: center
    background: #ccc
    text-decoration: none
    margin: 25px 0 0
    font-size: inherit
.label
  font-size: 14px
  width: 100%
  color: #888
  font-weight: bold
  margin-top: 25px
  &:after
    content: ":"
.ask-loc
  display: block
  box-sizing: border-box
  width: 100%
  padding: 20px
  text-align: center
  background: #ccc
  text-decoration: none
  margin: 25px 0 0
  color: #444
.table {
  margin-top: 25px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
}
.column {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  flex: 1 1 50%;
  justify-content: flex-start;
  align-items: stretch;
}
</style>
