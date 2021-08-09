const { query } = require("./index");

module.exports = {
  async getAllPlayers(limit = 100, offset = 0) {
    try {
      const sql_query = `
      SELECT p.*, count(*) as games
        FROM players as p
        JOIN game_players as gp
        USING (steam_id)
        GROUP BY p.steam_id
        ORDER BY games DESC
        LIMIT $1 OFFSET $2
      `;
      const { rows } = await query(sql_query, [limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getLeaderboard() {
    try {
      const sql_query = `
      select * from players
      ORDER BY mmr DESC
      LIMIT 100
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getLeaderboardPosition(mmr) {
    try {
      const sql_query = `
      SELECT count(*) FROM players WHERE mmr > $1
      `;
      const { rows } = await query(sql_query, [mmr]);
      return rows[0] + 1;
    } catch (error) {
      throw error;
    }
  },

  async getPlayer(steamID) {
    try {
      const sql_query = `
      SELECT * FROM players WHERE steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID]);
      const player = rows[0];
      if (player) {
        const rank = await this.getLeaderboardPosition(player.mmr);
        player.rank = rank;
      }
      return player;
    } catch (error) {
      throw error;
    }
  },

  async doesPlayerExist(steamID) {
    try {
      const sql_query = `
      select * from players where steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  },

  async upsertPlayer(steamID, steamID64, username) {
    try {
      const { rows } = await query(
        `INSERT INTO players(steam_id, steam_id_64, username)
         VALUES ($1, $2, $3)
         ON CONFLICT(steam_id)
         DO UPDATE SET steam_id_64 = $2, username = $3
         RETURNING *`,
        [steamID, steamID64, username]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getGames(steamID, limit = 100, offset = 0, hours) {
    let whereClause = "";
    if (hours) {
      whereClause = "AND created_at >= NOW() - $4 * INTERVAL '1 HOURS'";
    }
    try {
      const sql_query = `
      SELECT g.*, gp.*
      FROM game_players gp
      JOIN games g
      USING (game_id)
      JOIN players p
      USING (steam_id)
      WHERE p.steam_id = $1
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
      `;
      if (hours) {
        const { rows } = await query(sql_query, [steamID, limit, offset, hours]);
        return rows;
      } else {
        const { rows } = await query(sql_query, [steamID, limit, offset]);
        return rows;
      }
    } catch (error) {
      throw error;
    }
  },
};
