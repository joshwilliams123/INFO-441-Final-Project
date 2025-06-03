import express from "express";
var router = express.Router();

router.post("/create", async (req, res, next) => {
  if (req.session.isAuthenticated) {
    const { teamName, members } = req.body;
    try {
      const teamData = await req.models.Post.exists({ teamName });
      if (!teamData) {
        const newTeamData = new req.models.Post({
          teamName,
          members,
          created_date: Date.now(),
        });
        await newTeamData.save();
        res.json({
          status: "success",
          message: "team created",
          team: newTeamData,
        });
      } else {
        res.json({ status: "error", message: "team already exists" });
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
