const textChannelOverview = require('../../models/textChannelModel');
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

                    const textChannels = client.channels.cache.filter(channel => channel.type === 0);
                    
                    textChannels.forEach(async (channel) => {
                        const channelData = fetchedChannelOverview.channels.find(ch => ch.channelId === channel.id);
                        if (!channelData) {
                            return;
                        }

                        const lastStatsIndex = channelData.dailyStats.length - 1;
                        const { messageCount, emojiSend, stickerSend } = channelData.dailyStats[lastStatsIndex];

                        if (!channelData.dailyStats.some(stats => stats.date === today)) {
                            await textChannelOverview.findOneAndUpdate(
                                {
                                    guildId: guild.id,
                                    'channels.channelId': channel.id,
                                },
                                {
                                    $push: {
                                        'channels.$.dailyStats': {
                                            date: today,
                                            messageCount,
                                            emojiSend,
                                            stickerSend,
                                        },
                                    },
                                },
                                { new: true }
                            );
                        }
                    });


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
                        }
                    }
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

