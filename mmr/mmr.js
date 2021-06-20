const getEloProbability = (winnerRating, loserRating) => {
  probability = 1.0 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  return probability;
};

// this was Flam3s's basic idea for points
const getPlacementPoints = (place, numPlayers) => {
  if (numPlayers == 3) {
    switch (place) {
      case 3:
        return -25;
      case 2:
        return 10;
      case 1:
        return 25;
    }
  } else if (numPlayers == 4) {
    switch (place) {
      case 4:
        return -50;
      case 3:
        return -25;
      case 2:
        return 25;
      case 1:
        return 50;
    }
  }
  return 0;
};

const getEloRatingChange = (winnerRank, loserRank, K = 50) => {
  const Pa = getEloProbability(winnerRank, loserRank);
  const ratingChange = Math.floor(K * (1 - Pa), 1);

  return ratingChange;
};

const getMatchRatingChange = (currentMMR, winners, losers) => {
  // Calculate rating by saying that we "beat" all players lower than us, and
  // "lost" to all players higher than us.
  let ratingChange = 0;
  for (const winner of winners) {
    ratingChange += getEloRatingChange(winner.mmr, currentMMR);
  }
  for (const loser of losers) {
    ratingChange += getEloRatingChange(currentMMR, loser.mmr);
  }

  return ratingChange;
};

module.exports = {
  getMatchRatingChange,
};
