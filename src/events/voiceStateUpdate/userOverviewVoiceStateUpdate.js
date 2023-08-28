const userOverview = require('../../models/userOverviewModel');
const formatDate = require('../../functions/formatDate');

const userVoiceStates = {};

module.exports = async (client, oldState, newState) => {
    try {
        client.guilds.cache.forEach(async (guild) => {
            const today = formatDate(new Date());

            const fetchedUserOverview = await userOverview.findOne({
                guildId: guild.id,
            });

            if (fetchedUserOverview && (newState.guild.id === guild.id || oldState.guild.id === guild.id)) {
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

                    if (channelId === oldState.channel.id && !newState.member.voice.mute) {
                        
                            
                       
                        await userOverview.findOneAndUpdate(
                            {
                                guildId: guild.id,
                                'users.userId': memberId,
                                'users.dailyStats.date': today,
                            },
                            {
                                $inc: {
                                    'users.$[outer].dailyStats.$[inner].voiceChannelMinutes': Math.floor(timeSpent / 60000),
                                },
                            },
                            {
                                new: true,
                                arrayFilters: [
                                    { 'outer.userId': memberId },
                                    { 'inner.date': today }
                                ]
                            }
                        );
                    }
                    delete userVoiceStates[memberId];
                }
            } else {
                console.log('Serwera nie ma w bazie danych lub nie podlega aktualizacji danych UserOverview');
                return;
            }
        });
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do User Overview: ${error}`);
    }
};

