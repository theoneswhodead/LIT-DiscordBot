const textChannelOverview = require('../../models/textChannelModel');
const formatDate = require('../../functions/formatDate')

module.exports = async (client, message) => {

    try {
            //client.guilds.cache.forEach( async (guild) => {
                const today = formatDate(new Date())
                const guildId = message.guild.id

                const fetchedChannelOverview= await textChannelOverview.findOne({
                    guildId: guildId,
                })

                if(fetchedChannelOverview) {

                    const channelId = message.channel.id;
                    console.log(channelId);

                    await textChannelOverview.findOneAndUpdate(
                        {
                            guildId: guildId,
                            'channels.channelId': channelId,
                            'channels.dailyStats.date': today,
                        },
                        {
                            $inc: {
                                'channels.$[outer].dailyStats.$[inner].messageCount': 1
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




                    // const

                    // const textChannels = guild.channels.cache.filter(channel => channel.type === 0);
                    
                   // textChannels.forEach(async (channel) => {
                        // const channelData = fetchedChannelOverview.channels.find(ch => ch.channelId === channelId);

                        // if (!channelData) {
                        //     return;
                        // }

                    // await textChannelOverview.findOneAndUpdate(
                    //     {
                    //         guildId: guildId,
                    //         'channels.channelId': channelId,
                    //         'dailyStats.date': today,
                    //     },
                    //     {
                    //         $inc: {
                    //             'dailyStats.$.messageCount': 1
                    //         }
                    //     },
                    //     { new: true } 
                    // );
                  //  });
                } else {
                    console.log('Serwera nie ma w bazie danych')
                    return;
                }
          //  });
            
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Server Overview`)
    }
 
}




