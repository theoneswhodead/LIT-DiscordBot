const serverOverview = require('../../models/serverOverviewModel')
const formatDate = require('../../functions/formatDate')

module.exports = async (client) => {

    try {
        client.guilds.cache.forEach( async (guild) => {

            //const today = new Date()   .toLocaleString("en-US", {timeZone: "Europe/Warsaw"})//.setHours(0, 0, 0, 0);
    
            const fetchedServerOverview = await serverOverview.findOne({
                guildId: guild.id,
             //   "dailyStats.date": new Date(today)
            })
          //  console.log(`today `, today);
            console.log(`guildID `, guild.id )
    
            if(!fetchedServerOverview){
                
                const newServer = new serverOverview({
                    guildId: guild.id,
                    dailyStats: [],
                })

                const newDailyStats = {
                    date: new Date(),
                    verificationLevel: guild.verificationLevel,
                    membersCount: guild.memberCount,
                    textChannelsCount: guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size,
                    voiceChannelsCount: guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size,
                    categoryCount: guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY').size,
                    roleCount: guild.roles.cache.size,
                    emojiCount: guild.emojis.cache.size,
                    stickersCount: guild.stickers.cache.size,
                    boostCount: guild.premiumSubscriptionCount
                };
                newServer.dailyStats.push(newDailyStats)

                await newServer.save();
                console.log(`Server o id: ${guild.id} został zapisany w bazie danych`)
            }
            return;
        });
        
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Server Overview`)
    }
 
}