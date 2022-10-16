require("dotenv").config();
const Ably = require("ably");

const ABLY_API_KEY = process.env.ABLY_API_KEY;

const GAME_ROOM_CAPACITY = 3;
const CANVAS_HEIGHT = 70;
const CANVAS_WIDTH = 70;
const MIN_PLAYERS_TO_START_GAME = 3;
const GAME_TICKER_MS = 100;
const PLAYER_DIRECTION = ["l", "r", "u", "d"];
const MAX_CORD = 70;
const X_RANGE = [...Array(MAX_CORD).keys()];
const Y_RANGE = [...Array(MAX_CORD).keys()];

let players = [];
let playerChannels = {};
let isOver = false;
let gameRoomName = "primary";
let gameRoom;
let gameTickerOn = false;

// instantiate to Ably
const realtime = new Ably.Realtime({
  key: ABLY_API_KEY,
  echoMessages: false,
});

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};
// wait until connection with Ably is established
// Assume that if the number of players goes over MIN_PLAYERS_TO_START_GAME, they cannot publish "enter" presence
realtime.connection.once("connected", () => {
  gameRoom = realtime.channels.get(gameRoomName);

  // subscribe to new players entering the game
  gameRoom.presence.subscribe("enter", (player) => {
    console.log("new player ", player);
    // I don't know what the player object looks like for now.
    const { clientId, data } = player;

    const name = data?.name || "";

    if (players.length > MIN_PLAYERS_TO_START_GAME) {
      gameRoom.publish("full-room");
      return;
    }

    playerChannels[clientId] = realtime.channels.get(
      "clientChannel-" + clientId
    );

    newPlayerObject = {
      id: clientId,
      cord: locatePlayer(),
      direction: PLAYER_DIRECTION.random(), // "l", "r", "u", "d"
      name,
      isDead: false,
      isPacman: false,
    };
    players.push(newPlayerObject);

    subscribeToPlayerInput(playerChannels[clientId], clientId);

    if (players.length === MIN_PLAYERS_TO_START_GAME) {
      const pacman = between(0, players.length);
      players[pacman].isPacman = true;
      gameTickerOn = true;
      gameLoop();
    }
  });

  // subscribe to players leaving the game
  gameRoom.presence.subscribe("leave", (player) => {
    players = players.filter((p) => p.id === player.clientId);
  });
});

function locatePlayer() {
  //could be improved
  const existingXs = players.map((player) => player.cord.x);
  const existingYs = players.map((player) => player.cord.y);
  const filteredX = X_RANGE.filter((x) => existingXs.includes(x));
  const filteredY = Y_RANGE.filter((y) => existingYs.includes(y));
  return [filteredX.random(), filteredY.random()];
}

// start the game tick
function gameLoop() {
  let tickInterval = setInterval(() => {
    if (!gameTickerOn) {
      clearInterval(tickInterval);
    } else {
      let isOver = false;
      let winner;
      let size = [CANVAS_WIDTH, CANVAS_HEIGHT];
      const killed = detectCollisions();
      const deadPlayers = players.filter((p) => p.isDead);

      if (deadPlayers.length === players.length - 1) {
        gameTickerOn = false;
        isOver = true;
        winner = players[0];
      }
      // fan out the latest game state
      gameRoom.publish("game-state", {
        size,
        players,
        isOver,
        killed,
        winner,
      });
    }
  }, GAME_TICKER_MS);
}

function detectCollisions() {
  let killed = 0;
  const pacman = players.findIndex((p) => p.isPacman);
  players.forEach(({ isPacman, cord }, idx) => {
    if (!isPacman) {
      if (
        players[pacman].cord[0] === cord[0] &&
        players[pacman].cord[1] === cord[1]
      ) {
        players[idx].isDead = true;
        killed++;
      }
    }
  });
  return killed;
}

// subscribe to each player's input events
function subscribeToPlayerInput(channelInstance, playerId) {
  channelInstance.subscribe("pos", (msg) => {
    let [
      {
        cord: [x, y],
      },
    ] = players.filter((p) => p.id != playerId);
    switch (msg.data.keyPressed) {
      case "l":
        if (x !== 0) {
          x -= 1;
        }
      case "r":
        if (x !== MAX_CORD) {
          x += 1;
        }
      case "u":
        if (y !== MAX_CORD) {
          y += 1;
        }
      case "d":
        if (y !== 0) {
          y -= 1;
        }
    }
    players = players.map((p) => {
      if (p.id === playerId) {
        p.cord = [x, y];
      }
    });
  });
}

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
