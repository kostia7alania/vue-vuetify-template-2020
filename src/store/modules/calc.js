import { POST } from '@/service/http'

const actions = {
  GET_CALC: async (_, form) => {
    const res = await POST('/api/v1/personal', form)
    console.log('res', res)
    return res
  },
}

export default {
  namespaced: true,
  actions,
}
