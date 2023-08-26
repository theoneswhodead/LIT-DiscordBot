const textChannelOverview = require('../../models/textChannelOverviewModel');
const schedule = require('node-schedule');
const formatDate = require('../../functions/formatDate');

module.exports = async (client) => {
    try {
        schedule.scheduleJob('*/10 * * * * *', async () => {
            for (const [guildId, guild] of client.guilds.cache) {
                const today = formatDate(new Date());


                const fetchedChannelOverview = await textChannelOverview.findOne({
                    guildId: guildId,
                });

                if (fetchedChannelOverview) {

                    const textChannels = guild.channels.cache.filter(channel => channel.type === 0);


                    textChannels.forEach(async (channel) => {
                        const channelData = fetchedChannelOverview.channels.find(ch => ch.channelId === channel.id);
                        if (!channelData) {
                            
                            console.log('nie ma channel data?')
                            return;
                        }

                        const todayStats = channelData.dailyStats.find(stats => stats.date === today);

                        const { dailyStats } = channelData;
                        const lastStats = dailyStats[dailyStats.length - 1];
                        const { messageCount, attachmentCount, stickerCount, linkCount, userMentionCount, roleMentionCount  } = lastStats;

                    //    const test =  await textChannelOverview.findOne({
                    //         guildId: guildId,
                    //         'channels.channelId': channel.id,
                    //          'channels.dailyStats.date': { $ne: today },
                    //     })


                    //     console.log('Test ', test);





                        if (!todayStats) {
                            // await textChannelOverview.findOneAndUpdate(
                            //     {
                            //         guildId: guildId,
                            //         'channels.channelId': channel.id,
                            //     },
                            //     {
                            //         $addToSet: {
                            //             'channels.$[outer].dailyStats': {
                            //                 $each: [{
                            //                     date: today,
                            //                     messageCount,
                            //                     emojiSend,
                            //                     stickerSend,
                            //                 }],
                            //             },
                            //         },
                            //     },
                            //     {
                            //         new: true,
                            //         arrayFilters: [{ 'outer.channelId': channel.id }],
                            //     }
                            // ); // test

                            await textChannelOverview.findOneAndUpdate(
                                {
                                    guildId: guildId,
                                    'channels.channelId': channel.id,
                                },
                                {
                                    $push: {
                                        'channels.$[outer].dailyStats': {
                                            date: today,
                                            messageCount: 0,
                                            attachmentCount: 0,
                                            stickerCount: 0,
                                            linkCount: 0,
                                            userMentionCount: 0,
                                            roleMentionCount: 0,
                                        },
                                    },
                                },
                                {
                                    new: true,
                                    arrayFilters: [{ 'outer.channelId': channel.id }],
                                }
                            );
        
                        }              
                    });

                   // console.log('serwer jest zapisany i czeka na aktualizacje');
                } else {
                    const newServerChannels = new textChannelOverview({
                        guildId: guildId,
                        channels: [],
                    });

                    const newDailyStats = {
                        date: today,
                        messageCount: 0,
                        attachmentCount: 0,
                        stickerCount: 0,
                        linkCount: 0,
                        userMentionCount: 0,
                        roleMentionCount: 0,
                    }
                    for (const [channelId, channel] of guild.channels.cache) {

                        const newChannel = {
                            channelId: channelId,
                            channelName: channel.name,
                            dailyStats: []
                        }
                        
                        if (channel.type === 0) {
                            
                            newChannel.dailyStats.push(newDailyStats)
                            newServerChannels.channels.push(newChannel)
                        }
                    }
                    await newServerChannels.save();
                    console.log(`Kanały tekstowe serwera o id: ${guildId} zostały zapisane w bazie danych`);
                }
            }
            return;
        });
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Text Channel Overview: ${error}`);
    }
};

