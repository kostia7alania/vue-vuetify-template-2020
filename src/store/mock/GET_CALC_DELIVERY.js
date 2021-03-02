const GET_CALC = {
  client_id: 1,
  dst_coordinates: {
    geo_lat: '55.777468',
    geo_lon: '37.589153',
  },
  acquiring: 1,
  cash_on_delivery: 40000.1,
  warehouse_id: 1,
  destination_address: '2-я Миусская ул., д. 1, Москва',
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
  declared_order_value: 40000.1,
  delivery_date: '2014-11-12',
  additional_services: 0,
  delivery_type: 0,
  category_id: 1,
}

export default GET_CALC
