import express from 'express';
import {createTeam, addPlayer, dropPlayer} from '../controllers/teamController.js';

const router = express.Router();

router.post('/create', createTeam);
router.post('/addPlayer', addPlayer);
router.post('/dropPlayer', dropPlayer);

export default router;