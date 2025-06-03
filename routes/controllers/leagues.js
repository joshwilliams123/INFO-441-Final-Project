import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const leagues = await req.models.League.find({});
        res.json(leagues);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leagues' });
    }
});

router.post('/', async (req, res) => {
    const { leagueName } = req.body;
    if (!leagueName) {
        return res.status(400).json({ error: 'League name is required' });
    }

    try {
        const newLeague = new req.models.League({ leagueName });
        await newLeague.save();
        res.status(201).json(newLeague);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create league' });
    }
});

export default router;