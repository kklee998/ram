const PORT = process.env.PORT || 3000
const server = require('./app')({
  logger: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV !== 'production'
  }
})

server.listen(PORT, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
