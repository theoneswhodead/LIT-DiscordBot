const textChannelOverview = require('../../models/textChannelOverviewModel');
const formatDate = require('../../functions/formatDate');

module.exports = async (client, channel) => {
    try {
        if (channel.type === 0) {
        const today = formatDate(new Date());
        const guildId = channel.guild.id
        const channelId = channel.id


        const fetchedTextChannelOverview = await textChannelOverview.findOne({
            guildId: guildId,
            'channels.channelId': channelId,
        });

        if (!fetchedTextChannelOverview) {
            await textChannelOverview.findOneAndUpdate(
                {
                    guildId: guildId,
                },
                {
                    $addToSet: {
                        'channels': {
                            channelId: channelId,
                            channelName: channel.name,
                            dailyStats: [
                                {
                                    date: today,
                                    messageCount: 0,
                                    attachmentCount: 0,
                                    stickerCount: 0,
                                    linkCount: 0,
                                    userMentionCount: 0,
                                    roleMentionCount: 0,
                                }
                            ]
                        }
                    },
                },
                {
                    new: true,
                }
            );
        }

        return;
    }
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Text Channel Overview: ${error}`);
    }
};
