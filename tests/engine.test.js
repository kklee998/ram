const engine = require('../engine')
const { test } = require('tap')
const possibleMoves = ['up', 'down', 'left', 'right']

test('test engine returns moves', async (t) => {
  const move = await engine({})
  t.equal(possibleMoves.some(possibleMove => move === possibleMove), true, 'move is up down left or right')
})
