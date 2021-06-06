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

function generateDanger(board) {
  // return an array of all snake and hazards coordinates
  const { snakes, hazards } = board;
  const snakeBody = snakes
    .map((snake) => snake.body.map((b) => ({ x: b.x, y: b.y })))
    .flat();
  return [...snakeBody, ...hazards];
}

function hazardCheck({ board, you }) {
  const { height: maxHeight = height - 1, width: maxWidth = width - 1 } = board;
  const dangers = generateDanger(board);
  return function (move) {
    if (move === "left") {
      const nextSquare = { x: you.head.x - 1, y: you.head.y };
      // wall check
      if (nextSquare.x < 0) return false;
      // snake and hazard check
      if (dangers.some((danger) => isEqual(danger, nextSquare))) return false;
    }
    if (move === "right") {
      const nextSquare = { x: you.head.x + 1, y: you.head.y };
      // wall check
      if (nextSquare.x >= maxWidth) return false;
      // snake and hazard check
      if (dangers.some((danger) => isEqual(danger, nextSquare))) return false;
    }
    if (move === "down") {
      const nextSquare = { x: you.head.x, y: you.head.y - 1 };
      // wall check
      if (nextSquare.y < 0) return false;
      // snake and hazard check
      if (dangers.some((danger) => isEqual(danger, nextSquare))) return false;
    }
    if (move === "up") {
      const nextSquare = { x: you.head.x, y: you.head.y + 1 };
      // wall check
      if (nextSquare.y >= maxHeight) return false;
      // snake and hazard check
      if (dangers.some((danger) => isEqual(danger, nextSquare))) return false;
    }
    return true;
  };
}

async function moveSelector(moves) {
  return moves[Math.floor(Math.random() * moves.length)];
}
async function engine(gs) {
  const { you } = gs;
  const legalMoves = await noBehind(you);
  const possibleMoves = legalMoves.filter(hazardCheck(gs));
  console.log("possibleMoves ==>", possibleMoves);
  if (possibleMoves.length === 0) return { move: "down", shout: "SEPPKKU" };
  const move = await moveSelector(possibleMoves);
  return { move, shout: move };
}

module.exports = { engine, hazardCheck, moveSelector };
