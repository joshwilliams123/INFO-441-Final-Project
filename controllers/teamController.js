import models from '../models.js';

export async function createTeam(req, res) {
    try {
        const { teamName, members } = req.body;
        // Validate input
        if (!teamName) {
            return res.status(400).json({ message: 'Team name is required.' });
        }
        // Create team with optional members
        const team = await models.Post.create({
            teamName,
            members: Array.isArray(members) ? members : []
        });
        res.status(201).json(team);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// export async function addPlayer( req, res) {
//     if (req.session.isAuthenticated) {
//         const {teamName, player} = req.body;
//         try {
//             const team = await req.models.findOne({ teamName }); 
//             if (team) {
//                 team.members.push(player);
//                 await team.save(); 
//                 res.status(200).json({ status: "success", message: "player added" });
//             } else {
//                 res.json ({status: "error", message: "team does not exist" });
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ status: "error", message: error.message });
//         }
//     } else {
//         res.status(401).json({ status: "error", message: "not logged in" });
//     }
// }

// export async function dropPlayer ( req, res) { 
//     if (req.session.isAuthenticated) {
//         const {teamName, player} = req.body;
//         try {
//             const team = await req.models.findOne({ teamName }); 
//             if (team) {
//                 team.members.pop(player);
//                 await team.save(); 
//                 res.status(200).json({ status: "success", message: "player dropped" });
//             } else {
//                 res.json ({status: "error", message: "team does not exist" });
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ status: "error", message: error.message });
//         }
//     } else {
//         res.status(401).json({ status: "error", message: "not logged in" });
//     }
// }; 