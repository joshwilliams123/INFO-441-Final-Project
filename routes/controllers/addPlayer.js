import express from "express";
var router = express.Router();

async function isPlayerInAnyTeam(req, playerName) {
  const allTeams = await req.models.Post.find({});
  return allTeams.some((team) => team.members.includes(playerName));
}

router.post("/", async (req, res) => {
  if (req.session.isAuthenticated) {
    const { teamName, player } = req.body;
    try {
      if (await isPlayerInAnyTeam(req, player)) {
        return res.json({
          status: "error",
          message: "This player is already on another team",
        });
      }

      const team = await req.models.Post.findOne({ teamName });
      if (team) {
        team.members.push(player);
        await team.save();
        res
          .status(200)
          .json({ status: "success", message: "player added", team });
      } else {
        res.json({ status: "error", message: "team does not exist" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  } else {
    res.status(401).json({ status: "error", message: "not logged in" });
  }
});

//Get the players from the team based on the current user logged in
router.get("/", async (req, res) => {
  if (req.session.isAuthenticated) {
    try {
      const team = await req.models.Post.findOne({
        username: req.session.account.username,
      });
      if (team) {
        res.status(200).json({ status: "success", team });
      } else {
        res.status(404).json({
          status: "error",
          message: "No team found for this user",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  } else {
    res.status(401).json({ status: "error", message: "not logged in" });
  }
});

export default router;
