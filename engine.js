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
    if (move === "left") return { move, x: x - 1, y: y };
    if (move === "right") return { move, x: x + 1, y: y };
    if (move === "down") return { move, x: x, y: y - 1 };
    if (move === "up") return { move, x: x, y: y + 1 };
  };
}

async function engine(gs) {
  const { you, board } = gs;
  const { head } = you;
  const { x, y } = head;

  const { height: maxHeight = height - 1, width: maxWidth = width - 1 } = board;

  const dangers = await generateDanger(board);
  const noBehindMoves = await noBehind(you);

  const legalMoves = noBehindMoves.map(generateNextSquares(x, y));
  const nonDangerMoves = legalMoves.filter((ns) => {
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
  console.log("possibleMoves ==>", nonDangerMoves);
  if (nonDangerMoves.length === 0) return { move: "down", shout: "SEPPKKU" };
  if (nonDangerMoves.length === 1) {
    const [onlyMove] = nonDangerMoves;
    const { move } = onlyMove;
    return { move, shout: move };
  }
  // look ahead
  const lookAheadMoves = nonDangerMoves.filter((sq) => {
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
    if (fms.length < 1) return false;
    return true;
  });
  console.log("look ahead moves ---->", lookAheadMoves);
  if (lookAheadMoves.length === 1) {
    const [onlyMove] = lookAheadMoves;
    const { move } = onlyMove;
    return { move, shout: move };
  }
  const finalMoves =
    lookAheadMoves.length > 2 ? lookAheadMoves : nonDangerMoves;
  console.log('final unsorted moves:::::::', finalMoves)
  // sort by distance to wall
  finalMoves.sort((first, second) => {
    
    let fDistance = 0;
    let sDistance = 0;
    const { move: firstMove, x: fx, y: fy } = first;
    const { move: secondMove, x: sx, y: sy } = second;

    if (firstMove === "left") {
      fDistance = fx - 0;
    }
    if (secondMove === "left") {
      sDistance = sx - 0;
    }

    if (firstMove === "right") {
      fDistance = Math.abs(fx - maxWidth);
    }
    if (secondMove === "right") {
      sDistance = Math.abs(sx - maxWidth);
    }

    if (firstMove === "up") {
      fDistance = Math.abs(fy - maxHeight);
    }
    if (secondMove === "up") {
      sDistance = Math.abs(sy - maxHeight);
    }

    if (firstMove === "down") {
      fDistance = fy - 0;
    }
    if (secondMove === "down") {
      sDistance = sy - 0;
    }

    return sDistance - fDistance
  });
  console.log('final sorted moves', finalMoves)
  const { move } = finalMoves[0]
  return { move, shout: move };
}

module.exports = { engine };
