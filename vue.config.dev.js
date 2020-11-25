const BACK = process.env.VUE_APP_API // ('10.0.5.154')

const configDev = {
  devServer: {
    proxy: {
      // all
      '^/api/(.*)$': {
        target: BACK,
      },
      // 'wss://(.*)/wss': {
      //   target: `wss://${ip}/wss`,
      //   changeOrigin: true,
      //   ws: true,
      //   onOpen,
      //   onClose,
      // },
    },
    overlay: {
      // warnings: true,
      errors: true,
    },
  },
}

// function onOpen(proxySocket) {
//   // listen for messages coming FROM the target here
//   console.log('[onOpen]', proxySocket)
//   proxySocket.on('data', message => {
//     console.log('msg', message)
//   })
// }

// function onClose(res, socket, head) {
//   // view disconnected websocket connections
//   console.log('[onClose] Client disconnected', res, socket, head)
// }

module.exports = configDev
