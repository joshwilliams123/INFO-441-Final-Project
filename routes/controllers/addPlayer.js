import express from "express";
var router = express.Router();

router.post("/", async (req, res) => {
  if (req.session.isAuthenticated) {
    const { teamName, player } = req.body;
    try {
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

export default router;
