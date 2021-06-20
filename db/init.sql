DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_players CASCADE;

CREATE TABLE IF NOT EXISTS games (
  game_id TEXT PRIMARY KEY,
  ranked BOOLEAN,
  duration INTEGER,
  num_players INTEGER,
  created_at TIMESTAMPTZ DEFAULT Now()
);

CREATE INDEX ix_games_created_at ON games (created_at);

CREATE TABLE IF NOT EXISTS players (
  steam_id TEXT PRIMARY KEY,
  mmr INT DEFAULT 1000,
  username TEXT
);

CREATE INDEX ix_players_mmr ON players (mmr);

CREATE TABLE IF NOT EXISTS game_players (
  game_id TEXT REFERENCES games (game_id) ON UPDATE CASCADE,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  CONSTRAINT game_players_pkey PRIMARY KEY (game_id, steam_id),

  rounds INTEGER,
  place INTEGER,
  mmr_change INTEGER DEFAULT 0
);