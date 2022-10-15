require("dotenv").config();
const Ably = require("ably");

const ABLY_API_KEY = process.env.ABLY_API_KEY;

const GAME_ROOM_CAPACITY = 3;
const CANVAS_HEIGHT = 700;
const CANVAS_WIDTH = 700;
const SHIP_PLATFORM = CANVAS_HEIGHT - 12;
const BULLET_PLATFORM = SHIP_PLATFORM - 32;
const PLAYER_VERTICAL_INCREMENT = 20;
const PLAYER_VERTICAL_MOVEMENT_UPDATE_INTERVAL = 1000;
const PLAYER_SCORE_INCREMENT = 5;
const P2_WORLD_TIME_STEP = 1 / 16;
const MIN_PLAYERS_TO_START_GAME = 3;
const GAME_TICKER_MS = 100;

let players = {};
let playerChannels = {};
let gameOn = false;
let alivePlayers = 0;
let totalPlayers = 0;
let gameRoomName = "primary";
let gameRoom;
let gameTickerOn = false;

// instantiate to Ably
const realtime = new Ably.Realtime({
  key: ABLY_API_KEY,
  echoMessages: false,
});

// wait until connection with Ably is established
realtime.connection.once("connected", () => {
  gameRoom = realtime.channels.get(gameRoomName);

  // subscribe to new players entering the game
  gameRoom.presence.subscribe("enter", (player) => {
    console.log("new player");
    let newPlayerId;
    alivePlayers++;
    totalPlayers++;
    newPlayerId = player.clientId;
    playerChannels[newPlayerId] = realtime.channels.get(
      "clientChannel-" + player.clientId
    );
    if (totalPlayers == 1) {
      gameTickerOn = true;
      startGameDataTicker();
    }
    newPlayerObject = {
      id: newPlayerId,
      x: playerXposition(colorIndex),
      y: playerYposition(colorIndex),
      score: 0,
      nickname: player.data.nickname,
      isAlive: true,
    };
    players[newPlayerId] = newPlayerObject;
    subscribeToPlayerInput(playerChannels[newPlayerId], newPlayerId);
  });

  // subscribe to players leaving the game
  gameRoom.presence.subscribe("leave", (player) => {
    let leavingPlayer = player.clientId;
    alivePlayers--;
    totalPlayers--;
    delete players[leavingPlayer];
  });
  gameRoom.publish("thread-ready", {
    start: true,
  });
});

// start the game tick
function startGameDataTicker() {
  let tickInterval = setInterval(() => {
    if (!gameTickerOn) {
      clearInterval(tickInterval);
    } else {
      // fan out the latest game state
      gameRoom.publish("game-state", {
        // players: players,
        // playerCount: totalPlayers,
        // shipBody: copyOfShipBody.position,
        // bulletOrBlank: bulletOrBlank,
        // gameOn: gameOn,
        // killerBullet: killerBulletId,
      });
    }
  }, GAME_TICKER_MS);
}

// subscribe to each player's input events
function subscribeToPlayerInput(channelInstance, playerId) {
  channelInstance.subscribe("pos", (msg) => {
    if (msg.data.keyPressed == "left") {
      if (players[playerId].x - 20 < 20) {
        players[playerId].x = 25;
      } else {
        players[playerId].x -= 20;
      }
    } else if (msg.data.keyPressed == "right") {
      if (players[playerId].x + 20 > 1380) {
        players[playerId].x = 1375;
      } else {
        players[playerId].x += 20;
      }
    }
  });
  channelInstance.subscribe("start-game", (msg) => {});

  // subscribe to players being shot
  channelInstance.subscribe("dead-notif", (msg) => {});
}

// finish the game
function finishGame(playerId) {
  console.log("finished");

  gameRoom.publish("game-over", {
    winner: winnerName,
  });
}

function playerXposition(index) {
  switch (index) {
    case 0:
      return between(22, 246);
    case 1:
      return between(247, 474);
    case 2:
      return between(475, 702);
    case 3:
      return between(703, 930);
    case 4:
      return between(931, 1158);
    case 5:
      return between(1159, 1378);
    default:
      return between(22, 246);
  }
}

function playerYposition(index) {
  switch (index) {
    case 0:
      return between(22, 246);
    case 1:
      return between(247, 474);
    case 2:
      return between(475, 702);
    case 3:
      return between(703, 930);
    case 4:
      return between(931, 1158);
    case 5:
      return between(1159, 1378);
    default:
      return between(22, 246);
  }
}

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// generateGame()
// updatePlayer
// choosePacman(game)
