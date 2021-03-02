import faker from 'faker'

faker.locale = 'ru'

const PLAN = [
  {
    id: 1,
    date: new Date(),
    time: '9:00 - 11:00',
    service: 'Забор Возврат',
    number: 'Т2141340',
    address: 'Складочная ул., 1',
    status: 'Новый',
  },
]
window.faker = faker

const fakerData = new Array(100).fill().map(() => ({
  id: faker.random.uuid(),
  date: faker.date.future(),
  time: '9:00 - 11:00',
  service: 'Забор Возврат',
  number: `Т${faker.random.number(2141340)}`,
  address: faker.address.streetAddress(),
  status: 'Новый',

  // id: faker.random.float(),
  // application_id: faker.random.float(),
  // client_id: faker.random.float(),
  // rec_firstname: faker.name.firstName(),
  // rec_lastname: faker.name.lastName(),
  // rec_patronymic: faker.name.lastName(),
  // rec_email: faker.internet.email(),
  // rec_phone: `+7-${faker.phone.phoneNumber()}`,
  // rec_address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.country()}`,
  // category: 'Доставка',
  // product: 'Next day',
  // src_city: faker.address.city(),
  // dst_city: faker.address.city(),
  // price: faker.commerce.price(),
  // note: faker.lorem.words(5),
}))

export default [...PLAN, ...fakerData]
