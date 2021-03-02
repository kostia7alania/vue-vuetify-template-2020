import dayjs from 'dayjs'
import constants from '@/config/constants'

window.dayjs = dayjs
const { dateFormat, timeFormat, dateTimeFormat } = constants
const isToday = require('dayjs/plugin/isToday')
const isTomorrow = require('dayjs/plugin/isTomorrow')

dayjs.extend(isToday)
dayjs.extend(isTomorrow)

export const dateFormatter = date => {
  const dateObject = dayjs(date)
  if (!dateObject.isValid()) return date
  return dateObject.format(dateFormat)
}
export const timeFormatter = date => {
  const dateObject = dayjs(date)
  if (!dateObject.isValid()) return date
  return dateObject.format(timeFormat)
}
export const dateTimeFormatter = date => {
  const dateObject = dayjs(date)
  if (!dateObject.isValid()) return date
  return dateObject.format(dateTimeFormat)
}

export const date = dayjs
