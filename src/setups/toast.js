import Vue from 'vue'
import VueToast, { POSITION, TYPE } from 'vue-toastification'
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'
// не отображать в моменте полностью одинаковые сообщения
const filterBeforeCreate = (toast, toasts) => {
  if (toasts.find(t => t.content === toast.content && t.type === toast.type)) {
    // Returning false discards the toast
    return false
  }
  // You can modify the toast if you want
  return toast
}

const options = {
  // You can set your default options here
  timeout: 5000,
  position: POSITION.TOP_CENTER,
  type: TYPE.default,
  // closeOnClick: false,
  filterBeforeCreate,
}

Vue.use(VueToast, options)

const Toast = Vue.prototype.$toast

const types = ['default', 'warning', 'error', 'success', 'info']
const actions = {
  save: 'fa fa-save',
  add: 'fa fa-plus-circle',
  edit: 'fa fa-edit',
  remove: 'fa fa-trash-alt',
  feed: 'fa fa-rss',
  file: 'fa fa-file',
  start: 'fa fa-play-circle',
  stop: 'fa fa-stop-circle',
  refresh: 'fa fa-sync-alt fa-spin',
}

const icons = {
  save: {
    user: 'fa fa-user-check',
    users: 'fa fa-users',
    file: 'fa fa-file-upload',
    email: 'fa fa-paper-plane',
  },
  add: {
    user: 'fa fa-user-plus',
    users: 'fa fa-users',
    file: 'fa fa-file-medical',
  },
  edit: {
    user: 'fa fa-user-edit',
    users: 'fa fa-users-cog',
    file: 'fa fa-file-signature',
  },
  remove: {
    user: 'fa fa-user-slash',
    users: 'fa fa-users-slash',
    file: 'fa fa-file-invoice',
  },
}

/* const texts = {
  // @todo
  refresh: i18n.t('notification.Refreshed'),
}
*/

function toastHandler(text, params = {}) {
  /*
   * @GLOBAL TOSTER
   */

  // если вдруг надо будет быстро изменить тостер, тут можно будет его изменить
  const opts = {
    ...params,
  }

  if (!text && text !== 0) return console.warn(`[Toast] text is empty`, text)
  const msg = String(text)

  if (opts?.type && !types.includes(opts?.type)) {
    console.warn(`[Toast] type isn't recognized: ${opts.type}. Using default type.`)
    opts.type = 'default'
  }

  Toast(msg, opts)
}

types.forEach(type => {
  // add all types
  // vue.$global.toast.success('User added!')
  toastHandler[type] = (msg, opts = {}) => toastHandler(msg, { ...opts, type })

  // add actions icons from https://fontawesome.com/icons?d=gallery&q=remove&m=free
  // vue.$global.toast.success.feed('Пришла новость..')
  // vue.$global.toast.remove('График удален!')

  Object.entries(actions).forEach(([action, icon]) => {
    const cb = (msg, opts = {}) => toastHandler(msg, { ...opts, type, icon })
    toastHandler[type][action] = cb
    toastHandler[action] = cb
    toastHandler[action][type] = cb
    const pict = icons[action]
    if (pict) {
      Object.entries(pict).forEach(([actionPicName, actionIcon]) => {
        const callBack = (msg, opts = {}) => toastHandler(msg, { ...opts, type, icon: actionIcon })

        toastHandler[type][action][actionPicName] = callBack
      })
    }
  })
})

export default toastHandler
