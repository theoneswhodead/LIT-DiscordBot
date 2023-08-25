const mongoose = require('mongoose')

const Schema = mongoose.Schema()

const numDefault = {
    type: Number,
    default: 0 
}

const strReqUniq = {
    type: String,
    require: true,
    unique: true, 
}

const dailyTextChannelSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
       // unique: true,
    },
    messageCount: numDefault,
    emojiSend: numDefault,
    stickerSend: numDefault,
})

const textChannelSchema = new mongoose.Schema({
    channelId: strReqUniq,
    dailyStats: [dailyTextChannelSchema]

})

const textChannelOverviewSchema = new mongoose.Schema({
    guildId: strReqUniq,
    channels: [textChannelSchema]
    },{
        timestamps: true
    })




module.exports = mongoose.model('textChannelOverview', textChannelOverviewSchema);


