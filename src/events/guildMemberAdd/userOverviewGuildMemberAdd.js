const userOverview = require('../../models/userOverviewModel');
const formatDate = require('../../functions/formatDate');

module.exports = async (client, member) => {
    try {
        const today = formatDate(new Date());
        const guildId = member.guild.id;

        const fetchedUserOverview = await userOverview.findOne({
            guildId: guildId,
            'users.userId': member.id,
        });

        if (!fetchedUserOverview) {
            await userOverview.findOneAndUpdate(
                {
                    guildId: guildId,
                },
                {
                    $addToSet: {
                        'users': {
                            userId: member.id,
                            userName: member.user.username,
                            dailyStats: [
                                {
                                    date: today,
                                    messageCount: 0,
                                    attachmentCount: 0,
                                    stickerCount: 0,
                                    linkCount: 0,
                                    userMentionCount: 0,
                                    roleMentionCount: 0,
                                    voiceChannelMinutes: 0,
                                    xpCount: 0,
                                    levelCount: 0,
                                    balance: 0,
                                    warnCount: 0
                                }
                            ]
                        }
                    },
                },
                {
                    new: true,
                }
            );
        }

        return;
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do User Overview: ${error}`);
    }
};
