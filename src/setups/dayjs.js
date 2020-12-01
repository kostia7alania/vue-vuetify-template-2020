import dayjs from 'dayjs'
import constants from '@/config/constants'

const { dateFormat, timeFormat, dateTimeFormat } = constants
const isToday = require('dayjs/plugin/isToday')
const isTomorrow = require('dayjs/plugin/isTomorrow')

dayjs.extend(isToday)
dayjs.extend(isTomorrow)

export const dateFormatter = date => date(date).format(dateFormat)
export const timeFormatter = date => dayjs(date).format(timeFormat)
export const dateTimeFormatter = date => dayjs(date).format(dateTimeFormat)

export const date = dayjs
