import { POST } from '@/service/http'

const actions = {
  GET_CALC: async (_, form) => {
    /* @RESPONSE
    [ {
        "delivery_type_name": "next day",
        "price": 380,
        "date": "2020-11-25T16:53:27.266719193+03:00"
    } ]
  */
    const { data } = await POST('/api/v1/personal', form)
    console.log('data', data)
    return data
  },
}

export default {
  namespaced: true,
  actions,
}
