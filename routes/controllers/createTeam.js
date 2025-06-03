import express from "express";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
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
          league: leagueId,
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

router.get("/player-names", async (req, res) => {
  const csvPath = path.join(process.cwd(), "data", "players.csv");
  const playerNames = [];
  fs.createReadStream(csvPath)
    .pipe(parse({ columns: true }))
    .on("data", (row) => {
      if (row.Player && !playerNames.includes(row.Player)) {
        playerNames.push(row.Player.trim());
      }
    })
    .on("end", () => {
      res.json(playerNames);
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to read player names" });
    });
});

export default router;
