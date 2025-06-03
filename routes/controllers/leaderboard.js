import express from 'express';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const router = express.Router();

router.get('/api/leaderboard', (req, res) => {
  const csvPath = path.join(process.cwd(), 'data', 'players.csv');
  const csvData = fs.readFileSync(csvPath, 'utf8');
  const records = parse(csvData, { columns: true, skip_empty_lines: true });

  const leaderboard = records.map(player => {
    const pts = Number(player.PTS) || 0;
    const fg3m = Number(player['3P']) || 0;
    const fga = Number(player.FGA) || 0;
    const fgm = Number(player.FG) || 0;
    const fta = Number(player.FTA) || 0;
    const ftm = Number(player.FT) || 0;
    const reb = Number(player.TRB) || 0;
    const ast = Number(player.AST) || 0;
    const stl = Number(player.STL) || 0;
    const blk = Number(player.BLK) || 0;
    const tov = Number(player.TOV) || 0;

    const fantasyPoints =
      pts * 1 +
      fg3m * 1 +
      fga * -1 +
      fgm * 2 +
      fta * -1 +
      ftm * 1 +
      reb * 1 +
      ast * 2 +
      stl * 4 +
      blk * 4 +
      tov * -2;

    return {
      Player: player.Player,
      Team: player.Team,
      PTS: player.PTS,
      FantasyPoints: fantasyPoints
    };
  });

  leaderboard.sort((a, b) => b.FantasyPoints - a.FantasyPoints);
  res.json(leaderboard.slice(0, 20));
});

export default router;