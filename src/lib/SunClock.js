import SunCalc from 'suncalc'
import {
  differenceInSeconds,
  addDays,
  subDays,
  startOfDay,
  isBefore,
  addSeconds
} from 'date-fns'

const H12_IN_SEC = 12 * 60 * 60

export default class SunClock {
  constructor (loc, date) {
    this._date = date || new Date()
    this._loc = loc
  }

  get date () {
    return this._date
  }

  get today () {
    return this._date
  }

  get tommorow () {
    return addDays(this._date, 1)
  }

  get yesterday () {
    return subDays(this._date, 1)
  }

  get location () {
    return this._loc
  }

  get times () {
    return SunCalc.getTimes(this.today, this.location.latitude, this.location.longitude)
  }

  get tomorrowTimes () {
    return SunCalc.getTimes(this.tommorow, this.location.latitude, this.location.longitude)
  }

  get yesterdayTimes () {
    return SunCalc.getTimes(this.yesterday, this.location.latitude, this.location.longitude)
  }

  get byzOffset () {
    return differenceInSeconds(startOfDay(this.today), this.yesterdayTimes.sunset)
  }

  get byzTime () {
    return addSeconds(this.date, this.byzOffset)
  }

  get dayLength () {
    let sunrise = this.times.sunrise
    let sunset = this.times.sunset
    let l = differenceInSeconds(sunset, sunrise)
    let h = Math.floor(l / 3600)
    let m = Math.floor((l - h * 3600) / 60)
    let s = l - h * 3600 - m * 60
    let res = new Date(this.date.getUTCFullYear(), this.date.getMonth(), this.date.getDate(), h, m, s)
    return res
  }

  get nightLength () {
    let sunrise = this.times.sunrise
    let sunset = this.times.sunset
    let l
    if (isBefore(this.date, sunrise)) {
      sunset = this.yesterdayTimes.sunset
      l = differenceInSeconds(sunrise, sunset)
    } else {
      sunrise = this.tomorrowTimes.sunrise
      l = differenceInSeconds(sunrise, sunset)
    }
    let h = Math.floor(l / 3600)
    let m = Math.floor((l - h * 3600) / 60)
    let s = l - h * 3600 - m * 60
    let res = new Date(this.date.getUTCFullYear(), this.date.getMonth(), this.date.getDate(), h, m, s)
    return res
  }

  get sunTime () {
    let sunrise = this.times.sunrise
    let sunset = this.times.sunset
    let q, res
    if (isBefore(this.date, sunrise)) {
      sunset = this.yesterdayTimes.sunset
      q = differenceInSeconds(this.date, sunset) / differenceInSeconds(sunrise, sunset)
      res = addSeconds(startOfDay(this.date), q * H12_IN_SEC)
    } else if (isBefore(this.date, sunset)) {
      q = differenceInSeconds(this.date, sunrise) / differenceInSeconds(sunset, sunrise)
      res = addSeconds(startOfDay(this.date), q * H12_IN_SEC)
    } else {
      sunrise = this.tomorrowTimes.sunrise
      q = differenceInSeconds(this.date, sunset) / differenceInSeconds(sunrise, sunset)
      res = addSeconds(startOfDay(this.date), q * H12_IN_SEC)
    }
    return res
  }

  dayHour (h) {
    const sunrise = this.times.sunrise
    const sunset = this.times.sunset
    const l = h / 12 * differenceInSeconds(sunset, sunrise)
    const res = addSeconds(sunrise, l)
    return res
  }

  nightHour (h) {
    let sunrise = this.times.sunrise
    let sunset = this.times.sunset
    let l, res
    if (isBefore(this.date, sunrise)) {
      sunset = this.yesterdayTimes.sunset
      l = h / 12 * differenceInSeconds(sunrise, sunset)
      res = addSeconds(sunset, l)
    } else {
      sunrise = this.tomorrowTimes.sunrise
      l = h / 12 * differenceInSeconds(sunrise, sunset)
      res = addSeconds(sunset, l)
    }
    return res
  }
}

