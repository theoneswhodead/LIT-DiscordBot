const voiceChannelOverview = require('../../models/voiceChannelOverviewModel')
const formatDate = require('../../functions/formatDate');

module.exports = async (client, channel) => {
    try {
        if (channel.type === 2) {
        const today = formatDate(new Date());
        const guildId = channel.guild.id
        const channelId = channel.id


        const fetchedVoiceChannelOverview = await voiceChannelOverview.findOne({
            guildId: guildId,
            'channels.userId': channelId,
        });

        if (!fetchedVoiceChannelOverview) {
            await voiceChannelOverview.findOneAndUpdate(
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
                                    voiceChannelMinutes: 0,
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
        console.log(`Wystąpił błąd podczas zapisu danych do Voice Channel Overview: ${error}`);
    }
};
