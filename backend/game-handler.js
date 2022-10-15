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
const PLAYER_DIRECTION = ['l', 'r', 'u', 'd']
const MAX_CORD = 70;
const X_RANGE = [...Array(MAX_CORD).keys()]
const Y_RANGE = [...Array(MAX_CORD).keys()]


let players = []
let playerChannels = {};
let isOver = false;
let alivePlayers = 0;
let gameRoomName = "primary";
let gameRoom;
let gameTickerOn = false;

// instantiate to Ably
const realtime = new Ably.Realtime({
  key: ABLY_API_KEY,
  echoMessages: false,
});

Array.prototype.random = function(){
  return this[Math.floor(Math.random()*this.length)];
}
// wait until connection with Ably is established
// Assume that if the number of players goes over MIN_PLAYERS_TO_START_GAME, they cannot publish "enter" presence
realtime.connection.once("connected", () => {
  gameRoom = realtime.channels.get(gameRoomName);

  // subscribe to new players entering the game
  gameRoom.presence.subscribe("enter", (player) => {
    console.log("new player ", player);
    // I don't know what the player object looks like for now.
    const {clientId, data:{name}} = player

    if(players.length > MIN_PLAYERS_TO_START_GAME){
      gameRoom.publish("full-room")
      return;
    }

    playerChannels[newPlayerId] = realtime.channels.get(
      "clientChannel-" + clientId
    );

    newPlayerObject = {
      id: clientId,
      cord: locatePlayer(),
      direction: PLAYER_DIRECTION.random(), // "l", "r", "u", "d"
      name,
      isPacman: false,
      isDead: false,
    };
    players.push(newPlayerObject);

    subscribeToPlayerInput(playerChannels[clientId], clientId);
    
    if (players.length === MIN_PLAYERS_TO_START_GAME) {
      gameTickerOn = true;
      startGameDataTicker();
    }
  });

  // subscribe to players leaving the game
  gameRoom.presence.subscribe("leave", (player) => {  
    players = players.filter(p => p.id === player.clientId);
  });

});

function locatePlayer(){
  //could be improved
  const existingXs = players.map((player)=> player.cord.x)
  const existingYs = players.map((player)=> player.cord.y)
  const filteredX = X_RANGE.filter((x)=> existingXs.includes(x))
  const filteredY = Y_RANGE.filter((y)=> existingYs.includes(y))
  return [filteredX.random(), filteredY.random()]
}

// start the game tick
function startGameDataTicker() {
  let tickInterval = setInterval(() => {
    if (!gameTickerOn) {
      clearInterval(tickInterval);
    } else {
      // fan out the latest game state
      gameRoom.publish("game-state", {
        players: players,
        isOver: isOver,
        killed: numOfKilled,
        size: [CANVAS_WIDTH, CANVAS_HEIGHT]
      });
    }
  }, GAME_TICKER_MS);
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
    players = players.map((p) => { if (p.id === playerId) { p.cord = [x, y] } })
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
