const serverOverview = require('../../models/serverOverviewModel')
const formatDate = require('../../functions/formatDate')

module.exports = async (client, message) => {

    try {
                const today = formatDate(new Date())
                const guildId = message.guild.id

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
                            $inc: {
                                'dailyStats.$.messageCount': 1
                            }
                        },
                        { new: true } 
                    );
                } else {
                    console.log('Serwera nie ma w bazie danych')
                    return;
                }
            
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Server Overview`)
    }
 
}




