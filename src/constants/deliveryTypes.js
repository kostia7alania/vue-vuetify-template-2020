import i18n from '@/setups/i18n'

const h = new Date().getHours()

const deliveryTypes = [
  // в заказах это терь productIds.js !
  // ид берем с бека
  // { id: 0, text: i18n.t('calc.All'), default: true }, // отображать при любом раскладе
  { titleBack: 'next day', text: i18n.t('calc.Next Day Delivery') },
  { titleBack: 'same day', text: i18n.t('calc.Same Day Delivery'), canSelectTodayDate: true, disabled: h >= 16 }, // после 13 - незя!
  { titleBack: 'ship from store', text: i18n.t('calc.Delivery from the Store') },
  { titleBack: 'first mile', text: i18n.t('calc.First Mile'), isCustomSourceAddress: true },
  { titleBack: 'first mile plus', text: i18n.t('calc.First Mile Plus'), isCustomSourceAddress: true },
  { titleBack: 'delivery point', text: i18n.t('calc.Delivery Point'), isCustomSourceAddress: true },
]

export const getDeliveryTypeByTitleBack = titleBack => deliveryTypes.find(obj => obj.titleBack === titleBack)

export default deliveryTypes
