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

function noLookBehind(from) {
  if (from === "up") return ["down", "left", "right"];
  if (from === "down") return ["up", "left", "right"];
  if (from === "left") return ["down", "up", "right"];
  if (from === "right") return ["down", "left", "up"];
}

async function generateDanger(board) {
  // return an array of all snake and hazards coordinates
  const { snakes, hazards } = board;
  const snakeBody = snakes.flatMap((snake) =>
    snake.body.map((b) => ({ x: b.x, y: b.y }))
  );
  return [...snakeBody, ...hazards];
}

function generateNextSquares(x, y) {
  return function (move) {
    if (move === "left") {
      return { move, x: x - 1, y: y };
    }
    if (move === "right") {
      return { move, x: x + 1, y: y };
    }
    if (move === "down") {
      return { move, x: x, y: y - 1 };
    }
    if (move === "up") {
      return { move, x: x, y: y + 1 };
    }
  };
}

async function moveSelector(moves) {
  return moves[Math.floor(Math.random() * moves.length)];
}
async function engine(gs) {
  const { you, board } = gs;
  const { head } = you;
  const { x, y } = head;

  const { height: maxHeight = height - 1, width: maxWidth = width - 1 } = board;

  const dangers = await generateDanger(board);
  const legalMoves = await noBehind(you);

  const moveset = legalMoves.map(generateNextSquares(x, y));
  const fmovesets = moveset.filter((ns) => {
    const { move, x, y } = ns;
    if (dangers.some((danger) => isEqual(danger, { x, y }))) return false;
    if (move === "left") {
      if (x < 0) return false;
    }
    if (move === "right") {
      if (x >= maxWidth) return false;
    }
    if (move === "down") {
      if (y < 0) return false;
    }
    if (move === "up") {
      if (y >= maxHeight) return false;
    }
    return true;
  });
  console.log("possibleMoves ==>", fmovesets);
  if (fmovesets.length === 0) return { move: "down", shout: "SEPPKKU" };
  // look ahead
  const ffmovesets = fmovesets.filter((sq) => {
    const { move, x, y } = sq;
    const m = noLookBehind(move);
    const ms = m.map(generateNextSquares(x, y));
    const fms = ms.filter((ns) => {
      const { move, x, y } = ns;
      if (dangers.some((danger) => isEqual(danger, { x, y }))) return false;
      if (move === "left") {
        if (x < 0) return false;
      }
      if (move === "right") {
        if (x >= maxWidth) return false;
      }
      if (move === "down") {
        if (y < 0) return false;
      }
      if (move === "up") {
        if (y >= maxHeight) return false;
      }
      return true;
    });
    if (fms.length < 1) return true;
    return false;
  });
  console.log("look ahead moves ---->", ffmovesets);
  const { move } = await moveSelector(ffmovesets);
  return { move, shout: move };
}

module.exports = { engine, moveSelector };
