const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'
const server = require('./app')({
  logger: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV !== 'production'
  }
})

server.ready().then(() => {
  server.log.info('successfully booted!')
}, (err) => {
  server.log.info('an error happened', err)
})

server.listen(PORT, HOST, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
