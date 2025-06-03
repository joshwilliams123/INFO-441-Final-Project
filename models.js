import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")

await mongoose.connect("mongodb+srv://jaw67:12345@info441.ex3faqo.mongodb.net/final?retryWrites=true&w=majority&appName=INFO441")

const leagueSchema = new mongoose.Schema({
    leagueName: {
        type: String,
        required: true,
        unique: true
    },
    teams: {
        type: [String],
        default: []
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true
    },
    members: {
        type: [String],
        default: []
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

models.Post = mongoose.model('Team', teamSchema)
models.League = mongoose.model('League', leagueSchema)

console.log("finished creating models")

export default models
