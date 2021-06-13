const { engine } = require("../engine");
const { test } = require("tap");
const possibleMoves = ["up", "down", "left", "right"];

test("test engine returns moves", async (t) => {
  const { move, shout } = await engine({
    game: {
      id: "game-00fe20da-94ad-11ea-bb37",
      ruleset: {
        name: "standard",
        version: "v.1.2.3",
      },
      timeout: 500,
    },
    turn: 14,
    board: {
      height: 11,
      width: 11,
      food: [
        { x: 5, y: 5 },
        { x: 9, y: 0 },
        { x: 2, y: 6 },
      ],
      hazards: [{ x: 3, y: 2 }],
      snakes: [
        {
          id: "snake-508e96ac-94ad-11ea-bb37",
          name: "My Snake",
          health: 54,
          body: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
          ],
          latency: "111",
          head: { x: 0, y: 0 },
          length: 3,
          shout: "why are we shouting??",
          squad: "",
        },
        {
          id: "snake-b67f4906-94ae-11ea-bb37",
          name: "Another Snake",
          health: 16,
          body: [
            { x: 5, y: 4 },
            { x: 5, y: 3 },
            { x: 6, y: 3 },
            { x: 6, y: 2 },
          ],
          latency: "222",
          head: { x: 5, y: 4 },
          length: 4,
          shout: "I'm not really sure...",
          squad: "",
        },
      ],
    },
    you: {
      id: "snake-508e96ac-94ad-11ea-bb37",
      name: "My Snake",
      health: 54,
      body: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      latency: "111",
      head: { x: 0, y: 0 },
      length: 3,
      shout: "why are we shouting??",
      squad: "",
    },
  });
  t.equal(
    possibleMoves.some((possibleMove) => move === possibleMove),
    true,
    "move is up down left or right"
  );
});

test("hazard check returns the correct move to avoid the corner", async (t) => {
  const gs = {
    game: {
      id: "16e231f9-ad74-4214-8f26-47f7986c1fd2",
      ruleset: {
        name: "solo",
        version: "v1.0.17",
      },
      timeout: 500,
    },
    turn: 127,
    board: {
      height: 7,
      width: 7,
      snakes: [
        {
          id: "gs_JybTgP9CpSYjwX6DmvmRkQqV",
          name: "ram",
          latency: "183",
          health: 89,
          body: [
            {
              x: 0,
              y: 1,
            },
            {
              x: 1,
              y: 1,
            },
            {
              x: 1,
              y: 0,
            },
            {
              x: 2,
              y: 0,
            },
            {
              x: 2,
              y: 1,
            },
            {
              x: 3,
              y: 1,
            },
            {
              x: 3,
              y: 0,
            },
          ],
          head: {
            x: 0,
            y: 1,
          },
          length: 7,
          shout: "left",
        },
      ],
      food: [
        {
          x: 5,
          y: 4,
        },
      ],
      hazards: [],
    },
    you: {
      id: "gs_JybTgP9CpSYjwX6DmvmRkQqV",
      name: "ram",
      latency: "183",
      health: 89,
      body: [
        {
          x: 0,
          y: 1,
        },
        {
          x: 1,
          y: 1,
        },
        {
          x: 1,
          y: 0,
        },
        {
          x: 2,
          y: 0,
        },
        {
          x: 2,
          y: 1,
        },
        {
          x: 3,
          y: 1,
        },
        {
          x: 3,
          y: 0,
        },
      ],
      head: {
        x: 0,
        y: 1,
      },
      length: 7,
      shout: "left",
    },
  };
  const { move, shout } = await engine(gs);
  t.equal(move, "up");
});
