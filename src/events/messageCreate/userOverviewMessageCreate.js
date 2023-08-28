const userOverview = require('../../models/userOverviewModel');
const formatDate = require('../../functions/formatDate');

module.exports = async (client, message) => {
    try {
        const today = formatDate(new Date());
        const guildId = message.guild.id;
        const userId = message.author.id;

        const fetchedUserOverview = await userOverview.findOne({
            guildId: guildId,
            'users.userId': userId,
        });

        if (fetchedUserOverview) {
            const attachmentCount = message.attachments.size;
            const userMentionCount = message.mentions.users.size;
            const roleMentionCount = message.mentions.roles.size;
            const linkCount = message.content.match(/https?:\/\/[^\s]+/gi)?.length || 0;
            const stickerCount = message.stickers.size;

            await userOverview.findOneAndUpdate(
                {
                    guildId: guildId,
                    'users.userId': userId,
                    'users.dailyStats.date': today,
                },
                {
                    $inc: {
                        'users.$.dailyStats.$[inner].messageCount': 1,
                        'users.$.dailyStats.$[inner].attachmentCount': attachmentCount,
                        'users.$.dailyStats.$[inner].stickerCount': stickerCount,
                        'users.$.dailyStats.$[inner].linkCount': linkCount,
                        'users.$.dailyStats.$[inner].userMentionCount': userMentionCount,
                        'users.$.dailyStats.$[inner].roleMentionCount': roleMentionCount,
                    },
                },
                {
                    new: true,
                    arrayFilters: [{ 'inner.date': today }],
                }
            );
        } else {
            console.log('Serwera lub użytkownika nie ma w bazie danych');
            return;
        }
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do User Overview: ${error}`);
    }
};