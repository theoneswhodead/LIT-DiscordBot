const textChannelOverview = require('../../models/textChannelModel');
const formatDate = require('../../functions/formatDate')

module.exports = async (client, message) => {

    try {
                const today = formatDate(new Date())
                const guildId = message.guild.id

                const fetchedChannelOverview= await textChannelOverview.findOne({
                    guildId: guildId,
                })

                if(fetchedChannelOverview) {

                    const channelId = message.channel.id;
                    const attachmentCount = message.attachments.size;
                    const userMentionCount = message.mentions.users.size;
                    const roleMentionCount = message.mentions.roles.size;
                    const linkCount = message.content.match(/https?:\/\/[^\s]+/gi)?.length || 0;
                    const stickerCount = message.stickers.size


                    console.log(channelId);
                  //  console.log(emojiCount);

                    await textChannelOverview.findOneAndUpdate(
                        {
                            guildId: guildId,
                            'channels.channelId': channelId,
                            'channels.dailyStats.date': today,
                        },
                        {
                            $inc: {
                                'channels.$[outer].dailyStats.$[inner].messageCount': 1,
                                'channels.$[outer].dailyStats.$[inner].attachmentCount': attachmentCount,
                                'channels.$[outer].dailyStats.$[inner].stickerCount': stickerCount,
                                'channels.$[outer].dailyStats.$[inner].linkCount': linkCount,
                                'channels.$[outer].dailyStats.$[inner].userMentionCount': userMentionCount,
                                'channels.$[outer].dailyStats.$[inner].roleMentionCount': roleMentionCount,
                            }
                        },
                        {
                            new: true,
                            arrayFilters: [
                                { 'outer.channelId': channelId },
                                { 'inner.date': today }
                            ]
                        }
                    );

                } else {
                    console.log('Serwera nie ma w bazie danych')
                    return;
                }
            
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Text Channel Overview `, error)
    }
 
}




