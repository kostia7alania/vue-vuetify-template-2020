import faker from 'faker'

faker.locale = 'ru'

const GET_ORDERS = [
  {
    product_id: 1,
    client: {
      id: 1,
      address: {
        id: null,
        city: 'Москва',
        street: '2-я Миусская',
        house: '1/10',
        flat: 1,
        entrance: 1,
        floor: 1,
        is_private_house: false,
        title: 'Москва 2-я Миусская 1',
      },
      coordinates: { lat: 55.777611, lon: 37.5897128 },
    },
    recipient: {
      address: { city: 'Москва', street: 'Москворечье', house: '2Ж', flat: 2 },
      coordinates: { lat: 55.65118, lon: 37.64239 },
      firstname: 'а',
      lastname: 'аа',
      patronymic: 'ааа',
      phone: '+7 968 060 80 71',
    },
    pickup_id: 1,
    payment_type_id: 2,
    delivery_date: '2021-02-24',
    nomenclatures: [{ sku: 'qwerty123', name: 'Телевизор samsung', price: 40000, quantity: 2, weight: 4.3, vat: 2 }],
    places: [{ name: 'Место 1', weight: 4.3, length: 50, width: 50, height: 50 }],
    additional_services: 0,
    declared_order_value: 22,
    cash_on_delivery: 22,
    weight: 2,
    client_order_number: '2',
    intervals: ['9:00', '12:00'],
    category_id: 1,
    delivery_service_id: 1,
  },
]
window.faker = faker

const getNomenclatures = () => ({
  sku: faker.commerce.price(),
  name: faker.commerce.product(),
  price: faker.commerce.price(),
  quantity: faker.commerce.price(),
  weight: faker.commerce.price(),
  vat: faker.commerce.price(),
})

const getPlace = () => ({
  name: faker.commerce.product(),
  weight: faker.commerce.price(),
  length: faker.commerce.price(),
  width: faker.commerce.price(),
  height: faker.commerce.price(),
})

const fakerData = new Array(100).fill().map(() => ({
  product_id: faker.random.float(),

  client: {
    id: 1,
    address: {
      id: null,
      city: faker.address.city(),
      street: faker.address.streetAddress(),
      house: '1/10',
      flat: 1,
      entrance: 1,
      floor: 1,
      is_private_house: false,
      title: `${faker.address.city()} ${faker.address.streetAddress()} 1`,
    },
    coordinates: { lat: 55.777611, lon: 37.5897128 },
  },
  recipient: {
    address: { city: faker.address.city(), street: faker.address.streetAddress(), house: '2Ж', flat: 2 },
    coordinates: { lat: 55.65118, lon: 37.64239 },
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    patronymic: faker.name.lastName(),
    phone: `+7-${faker.phone.phoneNumber()}`,
    email: faker.internet.email(),
  },
  pickup_id: faker.random.float(),
  payment_type_id: 2,
  delivery_date: `${faker.date
    .future()
    .getFullYear()}-${faker.date.future().getMonth()}-${faker.date.future().getDate()}`,
  nomenclatures: [getNomenclatures(), getNomenclatures(), getNomenclatures()],
  places: [getPlace(), getPlace(), getPlace()],
  price: faker.commerce.price(),
  additional_services: 0,
  note: faker.lorem.words(5),
  declared_order_value: faker.commerce.price(),
  cash_on_delivery: faker.commerce.price(),
  weight: faker.commerce.price(),
  client_order_number: '2',
  intervals: ['9:00', '12:00'],
  category_id: 1,
  delivery_service_id: 1,
}))

export default [...GET_ORDERS, ...fakerData]
/* OLD:

   {
    id: 1,
    application_id: 1,
    client_id: 1,
    rec_firstname: 'Петушков',
    rec_lastname: 'Перейро',
    rec_patronymic: 'Максимович',
    rec_email: 'email@email.com',
    rec_phone: '+7-(903)-344-56-98',
    rec_address: '2-я Миусская ул., д. 1, Москва',
    category: 'Доставка',
    product: 'Next day',
    src_city: 'Москва',
    dst_city: 'Сызрань',
    price: 1234.12,
    note: 'Заказ бла бла бла',
    nomenclatures: [
      {
        name: 'Телевизор samsung',
        places: [
          {
            weight: 4.3,
            dimensions: {
              length: 170.1,
              width: 60.1,
              height: 45.1,
            },
          },
        ],
      },
    ],
  }, */
