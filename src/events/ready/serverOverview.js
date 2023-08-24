const serverOverview = require('../../models/serverOverviewModel')
const schedule = require('node-schedule');
const formatDate = require('../../functions/formatDate')

module.exports = async (client) => {

    try {
        schedule.scheduleJob('*/10 * * * * *', async () => {
       //  schedule.scheduleJob('0 0 * * *', async () => {
            client.guilds.cache.forEach( async (guild) => {

                const today = formatDate(new Date())
        
                const fetchedServerOverview = await serverOverview.findOne({
                    guildId: guild.id,
                })

                if(fetchedServerOverview) {

                    const { joined, leaved, messageCount, voiceChannelMinutes } = fetchedServerOverview.dailyStats[fetchedServerOverview.dailyStats.length - 1];

                     await serverOverview.findOneAndUpdate(
                        {
                            guildId: guild.id,
                            'dailyStats.date': { $ne: today }, 
                        },
                        {
                            $push: {
                                dailyStats: {
                                    date: today,
                                    verificationLevel: guild.verificationLevel,
                                    membersCount: guild.memberCount,
                                    textChannelsCount: guild.channels.cache.filter(channel => channel.type === 0).size,
                                    voiceChannelsCount: guild.channels.cache.filter(channel => channel.type === 2).size,
                                    categoryCount: guild.channels.cache.filter(channel => channel.type === 4).size,
                                    roleCount: guild.roles.cache.size,
                                    emojiCount: guild.emojis.cache.size,
                                    stickersCount: guild.stickers.cache.size,
                                    boostCount: guild.premiumSubscriptionCount,
                                    joined,
                                    leaved,
                                    messageCount,
                                    voiceChannelMinutes
                                },
                            },
                        },
                        { new: true } 
                    );
                } else if(!fetchedServerOverview) {
                    
                    const newServer = new serverOverview({
                        guildId: guild.id,
                        dailyStats: [],
                    })

                    const newDailyStats = {
                        date: today,
                        verificationLevel: guild.verificationLevel,
                        membersCount: guild.memberCount,
                        textChannelsCount: guild.channels.cache.filter(channel => channel.type === 0).size,
                        voiceChannelsCount: guild.channels.cache.filter(channel => channel.type === 2).size,
                        categoryCount: guild.channels.cache.filter(channel => channel.type === 4).size,
                        roleCount: guild.roles.cache.size,
                        emojiCount: guild.emojis.cache.size,
                        stickersCount: guild.stickers.cache.size,
                        boostCount: guild.premiumSubscriptionCount,
                        joined: 0,
                        leaved: 0,
                        messageCount: 0,
                        voiceChannelMinutes: 0
                    };
                    newServer.dailyStats.push(newDailyStats)

                    await newServer.save();
                    console.log(`Server o id: ${guild.id} został zapisany w bazie danych`)
                }
            });
            return;
        });
        
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Server Overview`)
    }
 
}




