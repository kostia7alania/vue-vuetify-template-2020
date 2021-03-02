const GET_CALC = {
  client_id: 12345,
  source_address: '2-я Миусская ул., д. 1, Москва',
  destination_address: '2-я Миусская ул., д. 1, Москва',
  acquiring: 1, // 1 - оплата картой, 2 - оплата ДС
  // (если предоплата, то не важно какое значение, пусть будет 3 для общего понимания)
  coordinates: {
    geo_lat: '55.777468',
    geo_lon: '37.589153',
  },
  nomenclatures: [
    {
      name: 'Телевизор samsung',
      places: [
        {
          weight: 20,
          dimensions: {
            length: 170.1,
            width: 60.1,
            height: 45.1,
          },
        },
      ],
    },
  ],
  declared_order_value: 40000.1,
  delivery_date: '2014-11-12T11:45:26.371Z',
  interval_slots: [
    {
      from: '10:00',
      to: '14:00',
    },
  ],
  additional_services: 0,
  delivery_type: 1,
}

export default GET_CALC
