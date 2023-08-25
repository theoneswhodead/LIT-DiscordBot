const serverOverview = require('../../models/serverOverviewModel');
const formatDate = require('../../functions/formatDate');

const userVoiceStates = {};

module.exports = async (client, oldState, newState) => {
    try {
        client.guilds.cache.forEach(async (guild) => {
            const today = formatDate(new Date());

            const fetchedServerOverview = await serverOverview.findOne({
                guildId: guild.id,
            });

            if (fetchedServerOverview && (newState.guild.id === guild.id || oldState.guild.id === guild.id)) {
                const memberId = newState.member.id;

                if (newState.channel) {
                    userVoiceStates[memberId] = {
                        startTime: Date.now(),
                        channelId: newState.channel.id,
                    };
                } else if (oldState.channel && userVoiceStates[memberId]) {
                    const startTime = userVoiceStates[memberId].startTime;
                    const channelId = userVoiceStates[memberId].channelId;
                    const endTime = Date.now();
                    const timeSpent = endTime - startTime;

                    if (
                        channelId === oldState.channel.id && !newState.member.voice.mute ) { //temporaty
                        await serverOverview.findOneAndUpdate(
                            {
                                guildId: guild.id,
                                'dailyStats.date': today,
                            },
                            {
                                $inc: {
                                    'dailyStats.$.voiceChannelMinutes': Math.floor(timeSpent / 60000),
                                },
                            },
                            { new: true }
                        );
                    }
                    delete userVoiceStates[memberId];
                }
            } else {
                console.log('Serwera nie ma w bazie danych lub nie podlega aktualizacji danych');
                return;
            }
        });
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Server Overview: ${error}`);
    }
};


























// const serverOverview = require('../../models/serverOverviewModel')
// const formatDate = require('../../functions/formatDate')

// const userVoiceStates = {};

// module.exports = async (client, oldState, newState) => {

//     try {
//             client.guilds.cache.forEach( async (guild) => {
//                 const today = formatDate(new Date())

//                 const fetchedServerOverview = await serverOverview.findOne({
//                     guildId: guild.id,
//                 })
//                 if (fetchedServerOverview  && newState.guild.id === guild.id || oldState.guild.id === guild.id) {
//                     const memberId = newState.member.id;
        
//                     if (newState.channel) {

//                         userVoiceStates[memberId] = {
//                             startTime: Date.now(),
//                             channelId: newState.channel.id,   
//                         };

//                     } else if (oldState.channel && userVoiceStates[memberId]) {

//                         const startTime = userVoiceStates[memberId].startTime;
//                         const channelId = userVoiceStates[memberId].channelId;
//                         const endTime = Date.now();
//                         const timeSpent = endTime - startTime;

//                         if (channelId === oldState.channel.id) {

//                             console.log('update space ', Math.floor(timeSpent / 60000))
//                             await serverOverview.findOneAndUpdate(
//                                 {
//                                     guildId: guild.id,
//                                     'dailyStats.date': today,
//                                 },
//                                 {
//                                     $inc: {

//                                         'dailyStats.$.voiceChannelMinutes': Math.floor(timeSpent / 60000),
//                                     },
//                                 },
//                                 { new: true }
//                             );
//                             delete userVoiceStates[memberId];
//                         }
//                     }
//                 } else {
//                     console.log('Serwera nie ma w bazie danych lub nie podlega aktualizacji danych');
//                     return;
//                 }
                
//             });
            
//     } catch (error) {
//         console.log(`Wystąpił błąd podczas zapisu danych do Server Overview`)
//     }
 
// }
