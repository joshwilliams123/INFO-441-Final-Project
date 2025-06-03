import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")

await mongoose.connect("mongodb+srv://jaw67:12345@info441.ex3faqo.mongodb.net/final?retryWrites=true&w=majority&appName=INFO441")


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

console.log("finished creating models")

export default models
