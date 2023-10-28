const textChannelOverview = require('../../models/textChannelOverviewModel');
const formatDate = require('../../functions/formatDate');

module.exports = async (client, channel) => {
    try {
        if (channel.type === 0) {
            const today = formatDate(new Date());
            const guildId = channel.guild.id;
            const channelId = channel.id;

            // Wyszukaj dokument reprezentujący kanał w bazie danych
            const fetchedTextChannelOverview = await textChannelOverview.findOne({
                guildId: guildId,
                'channels.channelId': channelId,
            });

            if (fetchedTextChannelOverview) {
                // Usuń kanał z listy kanałów w bazie danych
                fetchedTextChannelOverview.channels = fetchedTextChannelOverview.channels.filter(
                    (channel) => channel.channelId !== channelId
                );
                await fetchedTextChannelOverview.save();
                return;
            }

            console.log('Kanał nie został znaleziony w bazie danych');
        }
    } catch (error) {
        console.log(`Wystąpił błąd podczas usuwania danych z Text Channel Overview: ${error}`);
    }
};