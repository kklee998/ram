const isEqual = require("lodash.isequal");

const MOVES = ["up", "down", "left", "right"];

function noBehind(me) {
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

function generateDanger(board) {
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
  const { head, health } = you;
  const { x, y } = head;

  const {
    height: maxHeight = height - 1,
    width: maxWidth = width - 1,
    food,
  } = board;

  const LOWHP = (maxHeight * maxWidth) / 2;

  const dangers = generateDanger(board);
  const noBehindMoves = noBehind(you);

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
    const [{ move }] = nonDangerMoves;
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
    const [{ move }] = lookAheadMoves;
    return { move, shout: move };
  }
  const finalMoves =
    lookAheadMoves.length > 2 ? lookAheadMoves : nonDangerMoves;
  console.log("final unsorted moves:::::::", finalMoves);
  // sort by distance to hazards and wall
  if (health > LOWHP) {
    finalMoves.sort((first, second) => {
      let fWeight = 0;
      let sWeight = 0;

      const { move: m1, x: x1, y: y1 } = first;
      // include hazards in same horizontal or vertical line
      const h1 = dangers.filter((d) => d.x === x1 || d.y === y1);
      // add wall coordinates
      if (m1 === "left") h1.push({ x: -1, y: y1 });
      if (m1 === "right") h1.push({ x: maxWidth, y: y1 });
      if (m1 === "up") h1.push({ x: x1, y: maxHeight });
      if (m1 === "down") h1.push({ x: x1, y: -1 });

      [fWeight] = h1
        .map((f) => {
          const a = f.x - x1;
          const b = f.y - y1;
          return Math.sqrt(a * a + b * b);
        })
        .sort((a, b) => a - b);

      const { move: m2, x: x2, y: y2 } = second;
      const h2 = dangers.filter((d) => d.x === x2 || d.y === y2);

      if (m2 === "left") h2.push({ x: -1, y: y2 });
      if (m2 === "right") h2.push({ x: maxWidth, y: y2 });
      if (m2 === "up") h2.push({ x: x2, y: maxHeight });
      if (m2 === "down") h2.push({ x: x2, y: -1 });

      [fWeight] = h2
        .map((f) => {
          const a = f.x - x2;
          const b = f.y - y2;
          return Math.sqrt(a * a + b * b);
        })
        .sort((a, b) => a - b);

      return sWeight - fWeight;
    });
  } else {
    // find nearest food
    finalMoves.sort((first, second) => {
      let fWeight = 0;
      let sWeight = 0;

      const { x: x1, y: y1 } = first;
      [fWeight] = food
        .map((f) => {
          const a = f.x - x1;
          const b = f.y - y1;
          return Math.sqrt(a * a + b * b);
        })
        .sort((a, b) => a - b);

      const { x: x2, y: y2 } = second;
      [sWeight] = food
        .map((f) => {
          const a = f.x - x2;
          const b = f.y - y2;
          return Math.sqrt(a * a + b * b);
        })
        .sort((a, b) => a - b);

      return fWeight - sWeight;
    });
  }

  console.log("final sorted moves", finalMoves);
  const [{ move }] = finalMoves;
  return { move, shout: move };
}

module.exports = { engine };
