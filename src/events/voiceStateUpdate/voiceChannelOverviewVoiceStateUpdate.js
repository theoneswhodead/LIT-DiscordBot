const voiceChannelOverview = require('../../models/voiceChannelOverviewModel')
const formatDate = require('../../functions/formatDate');

const userVoiceStates = {};

module.exports = async (client, oldState, newState) => {
    try {
        client.guilds.cache.forEach(async (guild) => {
            const today = formatDate(new Date());

            const fetchedVoiceChannelOverview = await voiceChannelOverview.findOne({
                guildId: guild.id,
            });

            if (fetchedVoiceChannelOverview && (newState.guild.id === guild.id || oldState.guild.id === guild.id)) {
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
                        
                            
                       
                        await voiceChannelOverview.findOneAndUpdate(
                            {
                                guildId: guild.id,
                                'channels.channelId': channelId,
                                'channels.dailyStats.date': today,
                            },
                            {
                                $inc: {
                                    'channels.$[outer].dailyStats.$[inner].voiceChannelMinutes': Math.floor(timeSpent / 60000),
                                },
                            },
                            {
                                new: true,
                                arrayFilters: [
                                    { 'outer.channelId': channelId },
                                    { 'inner.date': today }
                                ]
                            }
                        );
                    }
                    delete userVoiceStates[memberId];
                }
            } else {
                console.log('Serwera nie ma w bazie danych lub nie podlega aktualizacji danych voiceChannelOverview');
                return;
            }
        });
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do Voice Channel Overview: ${error}`);
    }
};

