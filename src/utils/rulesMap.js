import { email, required, numeric } from 'vee-validate/dist/rules'
import parsePhoneNumber from 'libphonenumber-js'

export const rulesMap = {
  req: val => required.validate(val).valid || 'Поле обязательное',
  num: val => {
    // const pattern = Number.isNaN(parseInt(val, 10))
    // return !pattern || 'Введите валидное число'
    return numeric.validate(val) || 'Введите валидное число'
  },
  num_pos: value => value >= 0 || 'Должно быть положительным числом',
  num_pos_or_null: value => [null, undefined].includes(value) || value >= 0 || 'Должно быть положительным числом',
  email: v => !v || email.validate(v) || 'Почта должна быть валидна',
  tel: v =>
    ((String(v).length > 9 || String(v).length < 17) && parsePhoneNumber(String(v), 'RU')?.isValid()) ||
    'Номер невалидный',
}
export default rulesMap
