import Toast from '@/setups/toast'
import i18n from '@/setups/i18n'

const opts = {
  type: 'error',
}

const responceCodeMap = {
  401: i18n.t('notification.Please Log In'),
  403: i18n.t('notification.you are not authorized to view this section'),
}

const errorMap = errorMessage => {
  const errors = {
    // 'Session is expired. Please re-login': ['warning', i18n.t('errors.Session is expired')],
  }
  if (typeof errorMessage === 'string') {
    const found = Object.entries(errors).find(([key]) => errorMessage.match(key))
    if (!found) return
    const [type, message] = found[1]
    return [type, message]
  }
}

const errorResolver = error => {
  if (['string', 'number'].includes(typeof error)) {
    if (String(error).match('already exists')) {
      opts.type = 'warning'
    }

    if (error && i18n._exist(`notification.${error}`)) return i18n.t(`notification.${error}`)
    return error
  }

  if (!navigator.onLine) return i18n.t('notification.You are offline')
  const errMessage =
    error?.response?.data?.Message ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data

  if (errMessage && i18n._exist(`notification.${errMessage}`)) return i18n.t(`notification.${errMessage}`)
  if (error?.message && i18n._exist(`notification.${error.message}`)) return i18n.t(`notification.${error.message}`)

  const [type, message] = errorMap(errMessage) || []
  opts.type = type || opts.type
  const resMessage = message || responceCodeMap[error?.response?.status] || errMessage
  return resMessage
}

// обработчик ошибок тут:
const globalErrorHandler = error => {
  window.error = error
  const msg = errorResolver(error) || i18n.t('notification.Something Went Wrong')
  console.warn(msg, error)
  Toast(msg.replace('notification.', ''), opts)
  return msg
}

export default globalErrorHandler
