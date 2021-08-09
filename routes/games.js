const express = require("express");
const router = express.Router();
const keys = require("../config/keys");
const games = require("../db/games");

router.get("/", async (req, res) => {
  try {
    const limit = 100;
    const gameInfo = await games.getGames(limit);
    return res.status(200).json(gameInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:gameID", async (req, res) => {
  try {
    const gameID = req.params.gameID;
    const game = await games.getGameByID(gameID);
    return res.status(200).json(game);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/addGamePlayer", async (req, res) => {
  const { server_key, data } = req.body;

  const dedicatedServerKey = process.env.IS_PRODUCTION ? keys.dedicatedServerKey : keys.toolsKey;

  if (server_key != dedicatedServerKey) {
    res.status(403).send({ message: `You are not authorized to add data` });
    return;
  }

  try {
    const parsedData = JSON.parse(data);
    const result = await games.createGamePlayer(parsedData);
    res.status(201).json(result);
  } catch (error) {
    console.log(req.body.data);
    console.error(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/addGameDuration", async (req, res) => {
  const { server_key, data } = req.body;

  const dedicatedServerKey = process.env.IS_PRODUCTION ? keys.dedicatedServerKey : keys.toolsKey;

  if (server_key != dedicatedServerKey) {
    res.status(403).send({ message: `You are not authorized to add data` });
    return;
  }

  try {
    const parsedData = JSON.parse(data);
    const { matchID, duration } = parsedData;
    await games.setGameDuration(matchID, duration);
    res.status(201).send({ message: `Set game duration` });
  } catch (error) {
    console.log(req.body.data);
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
