const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const numReqUniq = {
    type: String,
    require: true,
    unique: true, 
}
const numDef = {
    type: Number,
    default: 0
}

const dailyStats = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    verificationLevel: numDef ,
    membersCount: numDef ,
    textChannelsCount: numDef ,
    voiceChannelsCount: numDef ,
    categoryCount: numDef ,
    roleCount: numDef,
    emojiCount: numDef ,
    stickersCount: numDef ,
    boostCount: numDef, 
})


const serverOverviewSchema = new Schema({
    guildId: numReqUniq,
    dailyStats: [dailyStats] 
    },{
        timestamps: true
    })

module.exports = mongoose.model('serverOverview', serverOverviewSchema);

// wszystkie kanały + = suma wiadomosci na dziem wartość date pole tutaj też dodać!
// kanały mają własną kolecje dokumentów, każdy kanał ma własny dokument

// message.channel.id  pobieranie id i ustawienie do dokumentu jeśli nie ma

//messageCreate event ->  trzeba pobrać kolekcje, znaleźć ten dokument w którym id kanału odpowiada id kanału na którym została wysłana wiadomość i ++,  
// na evencie messageCreate też lvl bedzie działać,

//
