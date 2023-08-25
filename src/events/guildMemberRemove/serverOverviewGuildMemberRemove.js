const serverOverview = require('../../models/serverOverviewModel')
const formatDate = require('../../functions/formatDate')

module.exports = async (client, member) => {

    try {
            //client.guilds.cache.forEach( async (guild) => {
                const today = formatDate(new Date())
                const guildId = member.guild.id
                const memberCount = member.guild.memberCount

                const fetchedServerOverview = await serverOverview.findOne({
                    guildId: guildId,
                })

                if(fetchedServerOverview) {

                    await serverOverview.findOneAndUpdate(
                        {
                            guildId: guildId,
                            'dailyStats.date': today,
                        },
                        {
                            $set: {
                                'dailyStats.$.membersCount': memberCount,
                            },
                            $inc: {
                                'dailyStats.$.leaved': 1
                            }
                        },
                        { new: true } 
                    );
                } else {
                    console.log('Serwera nie ma w bazie danych')
                    return;
                }
          //  });
            
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Server Overview`)
    }
 
}




