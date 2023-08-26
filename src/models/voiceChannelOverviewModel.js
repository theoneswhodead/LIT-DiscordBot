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

const dailyVoiceChannelSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    voiceChannelMinutes: numDefault,
})

const voiceChannelSchema = new mongoose.Schema({
    channelId: strReqUniq,
    channelName: {
        type: String,
        required: true,
       
    },
    dailyStats: [dailyVoiceChannelSchema]

})

const voiceChannelOverviewSchema = new mongoose.Schema({
    guildId: strReqUniq,
    channels: [voiceChannelSchema]
    },{
        timestamps: true
    })

module.exports = mongoose.model('voiceChannelOverview', voiceChannelOverviewSchema);


