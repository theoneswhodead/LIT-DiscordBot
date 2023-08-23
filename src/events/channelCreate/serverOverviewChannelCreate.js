const serverOverview = require('../../models/serverOverviewModel')
const formatDate = require('../../functions/formatDate')

module.exports = async (client) => {


    try {
            client.guilds.cache.forEach( async (guild) => {
                const today = formatDate(new Date())

                const fetchedServerOverview = await serverOverview.findOne({
                    guildId: guild.id,
                })

                if(fetchedServerOverview) {

                    await serverOverview.findOneAndUpdate(
                        {
                            guildId: guild.id,
                            'dailyStats.date': today,
                        },
                        {
                            $set: {
                                'dailyStats.$.textChannelsCount': guild.channels.cache.filter(channel => channel.type === 0).size,
                                'dailyStats.$.voiceChannelsCount': guild.channels.cache.filter(channel => channel.type === 2).size,
                                'dailyStats.$.categoryCount': guild.channels.cache.filter(channel => channel.type === 4).size,
                            },
                        },
                        { new: true } 
                    );
                } else {
                    console.log('Serwera nie ma w bazie danych')
                    return;
                }
            });
            
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Server Overview`)
    }
 
}




