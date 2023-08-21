const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const serverOverviewSchema = new Schema({
    guildId: {
        type: String,
        require: true,
    },
    verificationLevel: {
        type: Number,
    },
    membersCount: {
        type: Number,
        default: 0
    },
    textChannelsCount: {
        type: Number,
        default: 0
    },
    voiceChannelsCount: {
        type: Number,
        default: 0
    },
    categpryCount: {
        type: Number,
        default: 0
    },
    roleCount: {
        type: Number,
        default: 0
    },
    emojiCount: {
        type: Number,
        default: 0
    },
    stickersCount: {
        type: Number,
        default: 0
    },
    boostCount: {
        type: Number,
        default: 0
    }
}) 

// wszystkie kanały + = suma wiadomosci na dziem wartość date pole tutaj też dodać!
// kanały mają własną kolecje dokumentów, każdy kanał ma własny dokument

// message.channel.id  pobieranie id i ustawienie do dokumentu jeśli nie ma

//messageCreate event ->  trzeba pobrać kolekcje, znaleźć ten dokument w którym id kanału odpowiada id kanału na którym została wysłana wiadomość i ++,  
// na evencie messageCreate też lvl bedzie działać,

//
