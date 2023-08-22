const mongoose = require('mongoose')

const Schema = mongoose.Schema()

const numDefault = {
    type: Number,
    default: 0 
}

const textChannelSchema = new Schema({
    channelId: {
        type: Number,
        required: true,
    },
    messageCount: numDefault,
    emojiSend: numDefault,
    stickerSend: numDefault,
    },{
        timestamps: true
    })

//if(!data === data.now) {
  //  create new document
//}