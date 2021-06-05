const fastify = require('fastify')
const engine = require('./engine')

const getBattleSnakeSchema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          apiversion: { type: 'string' },
          author: { type: 'string' },
          color: { type: 'string' },
          head: { type: 'string' },
          tail: { type: 'string' },
          version: { type: 'string' }
        }
      }
    }
  }
}

const startEndSchema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          msg: { type: 'string' }
        }
      }
    }
  }
}

const moveSchema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          move: { type: 'string', enum: ['up', 'down', 'left', 'right'] },
          shout: { type: 'string' }
        }
      }
    }
  }
}

function build (opts = {}) {
  const app = fastify(opts)
  app.get('/', getBattleSnakeSchema, getBattleSnakeHandler)
  app.post('/start', startEndSchema, startGameHandler)
  app.post('/move', moveSchema, moveHandler)
  app.post('/end', startEndSchema, endGameHandler)

  return app
}

async function getBattleSnakeHandler (req, reply) {
  reply.send({
    apiversion: '1',
    author: 'kklee998',
    color: '#f3a2c0',
    head: 'default',
    tail: 'default',
    version: process.env.npm_package_version
  })
}

async function startGameHandler (req, reply) {
  req.log.info(req.body)
  reply.send({ msg: 'ok' })
}

async function endGameHandler (req, reply) {
  req.log.info(req.body)
  reply.send({ msg: 'ok' })
}

async function moveHandler (req, reply) {
  const { body } = req
  req.log.info(body)
  const move = await engine(body)
  reply.send({
    move,
    shout: move
  })
}

module.exports = build
