const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const morgan = require("morgan");
const gamesRouter = require("./routes/games");
const playersRouter = require("./routes/players");
const leaderboardRouter = require("./routes/leaderboard");

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("short"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "client/dist")));

app.use("/api/games", gamesRouter);
app.use("/api/players", playersRouter);
app.use("/api/leaderboard", leaderboardRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
