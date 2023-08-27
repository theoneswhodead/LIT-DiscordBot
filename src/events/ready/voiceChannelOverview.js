const voiceChannelOverview = require('../../models/voiceChannelOverviewModel')
const schedule = require('node-schedule');
const formatDate = require('../../functions/formatDate');

module.exports = async (client) => {
    try {
        schedule.scheduleJob('*/10 * * * * *', async () => {
            for (const [guildId, guild] of client.guilds.cache) {
                const today = formatDate(new Date());


                const fetchedChannelOverview = await voiceChannelOverview.findOne({
                    guildId: guildId,
                });

                if (fetchedChannelOverview) {

                    const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2);


                    voiceChannels.forEach(async (channel) => {
                        const channelData = fetchedChannelOverview.channels.find(ch => ch.channelId === channel.id);
                        if (!channelData) {
                            
                            console.log('nie ma channel data? voice')
                            return;
                        }

                        const todayStats = channelData.dailyStats.find(stats => stats.date === today);


                        if (!todayStats) {

                            await voiceChannelOverview.findOneAndUpdate(
                                {
                                    guildId: guildId,
                                    'channels.channelId': channel.id,
                                },
                                {
                                    $push: {
                                        'channels.$[outer].dailyStats': {
                                            date: today,
                                            voiceChannelMinutes: 0,
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
                } else {
                    const newServerChannels = new voiceChannelOverview({
                        guildId: guildId,
                        channels: [],
                    });

                    const newDailyStats = {
                        date: today,
                        voiceChannelMinutes: 0

                    }
                    for (const [channelId, channel] of guild.channels.cache) {

                        const newChannel = {
                            channelId: channelId,
                            channelName: channel.name,
                            dailyStats: []
                        }
                        
                        if (channel.type === 2) {
                            
                            newChannel.dailyStats.push(newDailyStats)
                            newServerChannels.channels.push(newChannel)
                        }
                    }
                    await newServerChannels.save();
                    console.log(`Kanały głosowe serwera o id: ${guildId} zostały zapisane w bazie danych`);
                }
            }
            return;
        });
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Voice Channel Overview: ${error}`);
    }
};

