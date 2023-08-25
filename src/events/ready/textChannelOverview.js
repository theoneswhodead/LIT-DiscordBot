const textChannelOverview = require('../../models/textChannelModel');
const schedule = require('node-schedule');
const formatDate = require('../../functions/formatDate');


module.exports = async (client) => {
    try {
        schedule.scheduleJob('*/10 * * * * *', async () => {
            for (const [guildId, guild] of client.guilds.cache) {
                const today = formatDate(new Date());

                console.log('guildId ', guildId)

                const fetchedChannelOverview = await textChannelOverview.findOne({
                    guildId: guildId,
                });

                if (fetchedChannelOverview) {
                    console.log('serwer jest zapisany i czeka na aktualizacje');
                } else {
                    const newServerChannels = new textChannelOverview({
                        guildId: guildId,
                        channels: [],
                    });

                    const newDailyStats = {
                        date: today,
                        messageCount: 0,
                        emojiSend: 0,
                        stickerSend: 0,
                    }
                    let i =0;
                   // const newChannelArray = [];
                    for (const [channelId, channel] of guild.channels.cache) {

                        const newChannel = {
                            channelId: channelId,
                            dailyStats: []
                        }
                        
                        if (channel.type === 0) {
                            i++;
                            console.log(i);

                            
                            newChannel.dailyStats.push(newDailyStats)
                            newServerChannels.channels.push(newChannel)
                            // newServerChannels.channels.push({
                            //     channelId: channelId,
                            //     dailyStats: [
                            //         {
                            //             date: today,
                            //             messageCount: 0,
                            //             emojiSend: 0,
                            //             stickerSend: 0,
                            //         },
                            //     ],
                            // });
                            console.log('channelId push', channelId)
                        }
                    }

                    //newServerChannels.channels = newChannelArray;
                    await newServerChannels.save();
                    console.log(`Kanały serwera o id: ${guildId} zostały zapisane w bazie danych`);
                }
            }
            return;
        });
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Text Channel Overview: ${error}`);
    }
};



































// const textChannelOverview = require('../../models/textChannelModel');
// const schedule = require('node-schedule');
// const formatDate = require('../../functions/formatDate');

// module.exports = async (client) => {

//     try {
//         schedule.scheduleJob('*/10 * * * * *', async () => {
//        //  schedule.scheduleJob('0 0 * * *', async () => {
//             client.guilds.cache.forEach( async (guild) => {

//                 const today = formatDate(new Date())
        
//                 const fetchedChannelOverview = await textChannelOverview.findOne({
//                     guildId: guild.id,
//                 })

//                 if(fetchedChannelOverview) {
//                     console.log('serwer jest zapisany i czeka na aktualizacje')

//                     // const { joined, leaved, messageCount, voiceChannelMinutes } = fetchedServerOverview.dailyStats[fetchedServerOverview.dailyStats.length - 1];

//                     //  await serverOverview.findOneAndUpdate(
//                     //     {
//                     //         guildId: guild.id,
//                     //         'dailyStats.date': { $ne: today }, 
//                     //     },
//                     //     {
//                     //         $push: {
//                     //             dailyStats: {
//                     //                 date: today,
//                     //                 verificationLevel: guild.verificationLevel,
//                     //                 membersCount: guild.memberCount,
//                     //                 textChannelsCount: guild.channels.cache.filter(channel => channel.type === 0).size,
//                     //                 voiceChannelsCount: guild.channels.cache.filter(channel => channel.type === 2).size,
//                     //                 categoryCount: guild.channels.cache.filter(channel => channel.type === 4).size,
//                     //                 roleCount: guild.roles.cache.size,
//                     //                 emojiCount: guild.emojis.cache.size,
//                     //                 stickersCount: guild.stickers.cache.size,
//                     //                 boostCount: guild.premiumSubscriptionCount,
//                     //                 joined,
//                     //                 leaved,
//                     //                 messageCount,
//                     //                 voiceChannelMinutes
//                     //             },
//                     //         },
//                     //     },
//                     //     { new: true } 
//                     // );
//                 } else if(!fetchedChannelOverview) {
                    
//                     const newServerChannels = new textChannelOverview({
//                         guildId: guild.id,
//                         channels: [],
//                     });
//                     let i = 0;
//                     guild.channels.cache.forEach((channel) => {
//                         if(channel.type === 0) {

//                             // const newChannel = {
//                             //     channelId: channel.id,
//                             //     dailyStats: [] 
//                             // }
        
//                             // const newDailyStats = {
//                             //     date: today,
//                             //     messageCount: 0,
//                             //     emojiSend: 0,
//                             //     stickerSend: 0,
//                             // };
//                             // newChannel.dailyStats.push(newDailyStats)
//                             // newServerChannels.channels.push(newChannel)
                            
//                             i++;
//                             console.log(today, i)
//                             console.log((channel.type === 0))
//                             newServerChannels.channels.push({
//                                 channelId: channel.id,
//                                 dailyStats: [
//                                     {
//                                         date: today,
//                                         messageCount: 0,
//                                         emojiSend: 0,
//                                         stickerSend: 0,
//                                     },
//                                 ],
//                             });
//                         }
//                     })



//                     await newServerChannels.save();
//                     console.log(`Kanały serwera o id: ${guild.id} zostały zapisane w bazie danych`);
//                 }
//             });
//             return;
//         });
        
//     } catch (error) {
//         console.log(`Wystąpił błąd podczas zapisu danych do Text Channel Overview: ${error}`);
//     }
 
// }
















// const textChannelOverview = require('../../models/textChannelModel');
// const schedule = require('node-schedule');
// const formatDate = require('../../functions/formatDate');

// module.exports = async (client) => {
//     try {
//         schedule.scheduleJob('*/10 * * * * *', async () => {
//             client.guilds.cache.forEach(async (guild) => {
//                 const today = formatDate(new Date());

//                 const fetchedChannelOverview = await textChannelOverview.findOne({
//                     guildId: guild.id,
//                 });

//                 if (fetchedChannelOverview) {
//                     const textChannels = client.channels.cache.filter(channel => channel.type === 'text');
                    
//                     textChannels.forEach(async (channel) => {
//                         await Promise.all(fetchedChannelOverview.channels.map(async (ch) => {
//                             const lastStatsIndex = ch.dailyStats.length - 1;
//                             const { messageCount, emojiSend, stickerSend } = ch.dailyStats[lastStatsIndex];

//                             await textChannelOverview.findOneAndUpdate(
//                                 {
//                                     guildId: guild.id,
//                                     'channels.channelId': channel.id,
//                                     'channels.dailyStats.date': { $ne: today },
//                                 },
//                                 {
//                                     $push: {
//                                         'channels.$.dailyStats': {
//                                             date: today,
//                                             messageCount,
//                                             emojiSend,
//                                             stickerSend,
//                                         },
//                                     },
//                                 },
//                                 { new: true }
//                             );
//                         }));
//                     });

//                 } else {
//                     const newServerChannels = new textChannelOverview({
//                         guildId: guild.id,
//                         channels: [],
//                     });

//                     const textChannels = client.channels.cache.filter(channel => channel.type === 'text');
//                     textChannels.forEach((channel) => {
//                         newServerChannels.channels.push({
//                             channelId: channel.id,
//                             dailyStats: [
//                                 {
//                                     date: today,
//                                     messageCount: 0,
//                                     emojiSend: 0,
//                                     stickerSend: 0,
//                                 },
//                             ],
//                         });
//                     });

//                     await newServerChannels.save();
//                     console.log(`Kanały serwera o id: ${guild.id} zostały zapisane w bazie danych`);
//                 }
//             });
//             return;
//         });
//     } catch (error) {
//         console.log(`Wystąpił błąd podczas zapisu danych do Text Channel Overview: ${error}`);
//     }
// };






// const textChannelOverview = require('../../models/textChannelModel');
// const schedule = require('node-schedule');
// const formatDate = require('../../functions/formatDate');

// module.exports = async (client) => {
//     try {
//         schedule.scheduleJob('*/10 * * * * *', async () => {
//             client.guilds.cache.forEach(async (guild) => {
//                 const today = formatDate(new Date());

//                 const fetchedChannelOverview = await textChannelOverview.findOne({
//                     guildId: guild.id,
//                 });

//                 if (fetchedChannelOverview) {

//                     client.channels.cache.filter(channel => channel.type === 0).forEach(async (channel) => {

//                         await Promise.all(fetchedChannelOverview.channels.map(async (ch) => {
//                             const lastStatsIndex = ch.dailyStats.length - 1;
//                             const { messageCount, emojiSend, stickerSend } = ch.dailyStats[lastStatsIndex];

                        
    
//                             await textChannelOverview.findOneAndUpdate(
//                                 {
//                                     guildId: guild.id,
//                                     'channels.channelId': channel.channelId,
//                                     'channels.dailyStats.date': { $ne: today },
//                                 },
//                                 {
//                                     $push: {
//                                         'channels.$.dailyStats': {
//                                             date: today,
//                                             messageCount,
//                                             emojiSend,
//                                             stickerSend,
//                                         },
//                                     },
//                                 },
//                                 { new: true }
//                             );
//                         }));

//                     })

//                 } else {
//                     const newServerChannels = new textChannelOverview({
//                         guildId: guild.id,
//                         channels: [],
//                     });

//                     client.channels.cache.filter(channel => channel.type === 0).forEach((channel) => {
//                         newServerChannels.channels.push({
//                             channelId: channel.id,
//                             dailyStats: [
//                                 {
//                                     date: today,
//                                     messageCount: 0,
//                                     emojiSend: 0,
//                                     stickerSend: 0,
//                                 },
//                             ],
//                         });
//                     });

//                     await newServerChannels.save();
//                     console.log(`Kanały serwera o id: ${guild.id} zostały zapisane w bazie danych`);
//                 }
//             });
//             return;
//         });
//     } catch (error) {
//         console.log(`Wystąpił błąd podczas zapisu danych do Text Channel Overview: ${error}`);
//     }
// };






















// const textChannelOverview = require('../../models/textChannelModel');
// const schedule = require('node-schedule');
// const formatDate = require('../../functions/formatDate');

// module.exports = async (client) => {
//     try {
//         schedule.scheduleJob('*/10 * * * * *', async () => {
//             client.guilds.cache.forEach(async (guild) => {
//                 const today = formatDate(new Date());

//                 const fetchedChannelOverview = await textChannelOverview.findOne({
//                     guildId: guild.id,
//                 });

//                 if (fetchedChannelOverview) {
//                     client.channels.cache.forEach(async (channel) => {
  
//                         const { messageCount, emojiSend, stickerSend } = fetchedChannelOverview.channels.dailyStats[fetchedChannelOverview.channels.dailyStats.length - 1];

//                         await textChannelOverview.findOneAndUpdate(
//                             {
//                                 guildId: guild.id,
//                                 'channels.channelId': channel.id,
//                                 'channels.dailyStats.date': { $ne: today },
//                             },
//                             {
//                                 $push: {
//                                     'channels.$.dailyStats': {
//                                         date: today,
//                                         messageCount,
//                                         emojiSend,
//                                         stickerSend,
//                                     },
//                                 },
//                             },
//                             { new: true }
//                         );
//                     });
//                 } else {
//                     const newServerChannels = new textChannelOverview({
//                         guildId: guild.id,
//                         channels: [],
//                     });

//                     client.channels.cache.forEach((channel) => {
//                         newServerChannels.channels.push({
//                             channelId: channel.id,
//                             dailyStats: [
//                                 {
//                                     date: today,
//                                     messageCount: 0,
//                                     emojiSend: 0,
//                                     stickerSend: 0,
//                                 },
//                             ],
//                         });
//                     });

//                     await newServerChannels.save();
//                     console.log(`Kanały servera o id: ${guild.id} zostały zapisane w bazie danych`);
//                 }
//             });
//             return;
//         });
//     } catch (error) {
//         console.log(`Wystąpił błąd podczas zapisu danych do Text Channel Overview: ${error}`);
//     }
// };












































// const channelOverview = require('../../models/textChannelModel')
// const schedule = require('node-schedule');
// const formatDate = require('../../functions/formatDate')

// module.exports = async (client) => {

//     try {
//         schedule.scheduleJob('*/10 * * * * *', async () => {
//        //  schedule.scheduleJob('0 0 * * *', async () => {
//             client.guilds.cache.forEach( async (guild) => {

//                 const today = formatDate(new Date())
        
//                 const fetchedServerOverview = await channelOverview.findOne({
//                     guildId: guild.id,
//                 })

//                 if(fetchedServerOverview) {

//                     const { messageCount, emojiSend, stickerSend } = fetchedServerOverview.channels.dailyStats[fetchedServerOverview.channels.dailyStats.length - 1];



//                     client.channels.cache.forEach( async (channel) => {

//                         await channelOverview.findOneAndUpdate(
//                             {
//                                 guildId: guild.id,
//                                 'channels.channelId': channel.id,
//                                 'channels.dailyStats.date': { $ne: today }, 
//                             },
//                             {
//                                 $push: {
//                                     dailyStats: {
//                                         date: today,
//                                         messageCount,
//                                         emojiSend,
//                                         stickerSend,
//                                     },
//                                 },
//                             },
//                             { new: true } 
//                         );

//                     } )



//                 } else if(!fetchedServerOverview) {
                    
//                     const newServerChannels = new channelOverview({
//                         guildId: guild.id,
//                         channels: []
//                         dailyStats: [],
//                     })

//                     const newDailyStats = {
//                         date: today,
//                         verificationLevel: guild.verificationLevel,
//                         membersCount: guild.memberCount,
//                         textChannelsCount: guild.channels.cache.filter(channel => channel.type === 0).size,
//                         voiceChannelsCount: guild.channels.cache.filter(channel => channel.type === 2).size,
//                         categoryCount: guild.channels.cache.filter(channel => channel.type === 4).size,
//                         roleCount: guild.roles.cache.size,
//                         emojiCount: guild.emojis.cache.size,
//                         stickersCount: guild.stickers.cache.size,
//                         boostCount: guild.premiumSubscriptionCount,
//                         joined: 0,
//                         leaved: 0,
//                         messageCount: 0,
//                         voiceChannelMinutes: 0
//                     };
//                     newServerChannels.dailyStats.push(newDailyStats)

//                     await newServerChannels.save();
//                     console.log(`Server o id: ${guild.id} został zapisany w bazie danych`)
//                 }
//             });
//             return;
//         });
        
//     } catch (error) {
//         console.log(`Wystąpił błąd podczas zapisu danych do Server Overview`)
//     }
 
// }




