const isEqual = require("lodash.isequal");

const MOVES = ["up", "down", "left", "right"];

async function noBehind(me) {
  const { body, length } = me;
  const [head, behind] = body;
  if (isEqual(head, behind) || length < 2) return MOVES;
  if (head.x - behind.x > 0) return MOVES.filter((move) => move !== "left");
  if (head.x - behind.x < 0) return MOVES.filter((move) => move !== "right");
  if (head.y - behind.y > 0) return MOVES.filter((move) => move !== "down");
  return MOVES.filter((move) => move !== "up");
}

async function engine(gs) {
  const { board, you } = gs;
  const { height: maxHeight = height - 1, width: maxWidth = width - 1 } = board;

  const legalMoves = await noBehind(you);
  const possibleMoves = legalMoves.filter((move) => {
    if (move === "left") {
      const nextSquare = { x: you.head.x - 1, y: you.head.y };
      // wall check
      if (nextSquare.x >= maxWidth) return false;
      // hazard check
      const hazSq = board.hazards.filter((hazard) =>
        isEqual(hazard, nextSquare)
      );
      if (hazSq.length > 0) return false;
      // snake check
      for (const snake of board.snakes) {
        for (const body of snake.body) {
          if (isEqual(nextSquare, body)) return false;
        }
      }
    }
    if (move === "right") {
      const nextSquare = { x: you.head.x + 1, y: you.head.y };
      // wall check
      if (nextSquare.x >= maxWidth) return false;
      // hazard check
      const hazSq = board.hazards.filter((hazard) =>
        isEqual(hazard, nextSquare)
      );
      if (hazSq.length > 0) return false;
      // snake check
      for (const snake of board.snakes) {
        for (const body of snake.body) {
          if (isEqual(nextSquare, body)) return false;
        }
      }
    }
    if (move === "down") {
      const nextSquare = { x: you.head.x, y: you.head.y -1 };
      // wall check
      if (nextSquare.y >= maxHeight) return false;
      // hazard check
      const hazSq = board.hazards.filter((hazard) =>
        isEqual(hazard, nextSquare)
      );
      if (hazSq.length > 0) return false;
      // snake check
      for (const snake of board.snakes) {
        for (const body of snake.body) {
          if (isEqual(nextSquare, body)) return false;
        }
      }
    }
    if (move === "up") {
      const nextSquare = { x: you.head.x, y: you.head.y + 1 };
      // wall check
      if (nextSquare.y >= maxHeight) return false;
      // hazard check
      const hazSq = board.hazards.filter((hazard) =>
        isEqual(hazard, nextSquare)
      );
      if (hazSq.length > 0) return false;
      // snake check
      for (const snake of board.snakes) {
        for (const body of snake.body) {
          if (isEqual(nextSquare, body)) return false;
        }
      }
    }
  });
  console.log(possibleMoves)
  const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  return move;
}

module.exports = engine;
