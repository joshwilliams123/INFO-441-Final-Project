import express from 'express';
var router = express.Router();
import sessions from 'express-session';

router.get('/', async function(req, res, next) {
  
});

export async function createTeam ( req, res, next) { 
    if (req.session.isAuthenticated) {
        const { teamName } = req.body;
        try {
            const teamData = await req.models.Team.exists({ teamName }); 
            if (!teamData) {
                const newTeamData = new req.models.Team({
                    teamName,
                    created_date: Date.now() 
                });
                await newTeamData.save();
                res.json({ status: "success", message: "team created" });
            } else {
                res.json ({status: "error", message: "team already exists" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    } else {
        res.status(401).json({ status: "error", message: "not logged in" });
    }
} 

export async function addPlayer( req, res, next) {
    if (req.session.isAuthenticated) {
        const {teamName, player} = req.body;
        try {
            const team = await req.models.findOne({ teamName }); 
            if (team) {
                team.members.push(player);
                await team.save(); 
                res.status(200).json({ status: "success", message: "player added" });
            } else {
                res.json ({status: "error", message: "team does not exist" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    } else {
        res.status(401).json({ status: "error", message: "not logged in" });
    }
}

export async function dropPlayer ( req, res, next) { 
    if (req.session.isAuthenticated) {
        const {teamName, player} = req.body;
        try {
            const team = await req.models.findOne({ teamName }); 
            if (team) {
                team.members.pop(player);
                await team.save(); 
                res.status(200).json({ status: "success", message: "player dropped" });
            } else {
                res.json ({status: "error", message: "team does not exist" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    } else {
        res.status(401).json({ status: "error", message: "not logged in" });
    }
}; 



export default TeamController;
