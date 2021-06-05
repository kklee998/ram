async function engine (board) {
  const possibleMoves = ['up', 'down', 'left', 'right']
  const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

  return move
}

module.exports = engine
