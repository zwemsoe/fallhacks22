require("dotenv").config();
const express = require("express");
const Ably = require("ably");
const app = express();
const { ABLY_API_KEY, PORT } = process.env;

// instantiate to Ably
const realtime = new Ably.Realtime({
  key: ABLY_API_KEY,
  echoMessages: false,
});

const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

require("./game-handler");

// app.get("/auth", (request, response) => {
//   const tokenParams = { clientId: nanoid() };
//   realtime.auth.createTokenRequest(tokenParams, function (err, tokenRequest) {
//     if (err) {
//       response
//         .status(500)
//         .send("Error requesting token: " + JSON.stringify(err));
//     } else {
//       response.setHeader("Content-Type", "application/json");
//       response.send(JSON.stringify(tokenRequest));
//     }
//   });
// });
