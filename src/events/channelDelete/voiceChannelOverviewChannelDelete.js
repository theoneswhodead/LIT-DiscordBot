const voiceChannelOverview = require('../../models/voiceChannelOverviewModel');
const formatDate = require('../../functions/formatDate');

module.exports = async (client, channel) => {
    try {
        if (channel.type === 2) {
            const today = formatDate(new Date());
            const guildId = channel.guild.id;
            const channelId = channel.id;

            const fetchedVoiceChannelOverview = await voiceChannelOverview.findOne({
                guildId: guildId,
                'channels.channelId': channelId,
            });

            if (fetchedVoiceChannelOverview) {
                fetchedVoiceChannelOverview.channels = fetchedVoiceChannelOverview.channels.filter(
                    (channel) => channel.channelId !== channelId
                );
                await fetchedVoiceChannelOverview.save();
                return;
            }

            console.log('Kanał nie został znaleziony w bazie danych');
        }
    } catch (error) {
        console.log(`Wystąpił błąd podczas usuwania danych z Voice Channel Overview: ${error}`);
    }
};