const { EmbedBuilder } = require('discord.js');
const userOverview = require('../../models/userOverviewModel');
const formatDate = require('../../functions/formatDate');
const config = require('../../../config.json');

const cooldowns = new Set()

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * ( max-min +1 )) + min
}

module.exports = async (client, message) => {

    if(!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

    const randomXp = getRandomXp(config.min_xp, config.max_xp);

    try {

        const today = formatDate(new Date());
        const guildId = message.guild.id;
        const userId = message.author.id;

        const fetchedUserOverview = await userOverview.findOne({
            guildId: guildId,
            'users.userId': userId,
        });

        if (fetchedUserOverview) {

            const userStats = fetchedUserOverview.users.find(user => user.userId === userId)
            const dailyStatsToday = userStats.dailyStats.find(stats => stats.date === today)
            let xpCount = dailyStatsToday.xpCount
            let levelCount = dailyStatsToday.levelCount

            console.log(xpCount)

            if(xpCount > (10 * (levelCount * levelCount) + 100 || 1)) {
                const serverAvatar = message.guild.iconURL({ size: 256 })
                const userAvatar = message.member.user.displayAvatarURL()
				let year = new Date()
                xpCount = 0
                levelCount += 1
                
                await userOverview.findOneAndUpdate(
                    {
                        guildId: guildId,
                        'users.userId': userId,
                        'users.dailyStats.date': today,
                    },
                    {
                        $set: {
                            'users.$.dailyStats.$[inner].xpCount': xpCount,
                            'users.$.dailyStats.$[inner].levelCount': levelCount,
                        },
                    },
                    {
                        new: true,
                        arrayFilters: [{ 'inner.date': today }],
                    }
                );
                cooldowns.add(message.author.id);
                setTimeout(() => {
                    cooldowns.delete(message.author.id)
                }, config.cooldown_xp)

                const LevelUpEmbed = new EmbedBuilder()
				.setColor(config.primaryColor)
				.setThumbnail(userAvatar)
                .setTimestamp()
                .addFields(
                    {
                        name: `${message.member.user.username} Gratulacje!`,
                        value: `Zdobyłeś: **${levelCount} Level**`
                    })
                .setFooter({ text: `© ${year.getFullYear()} ${message.guild.name}`, iconURL: serverAvatar})
                 
                await message.channel.send({embeds: [LevelUpEmbed]}).then(m => {
                    setTimeout(() => m.delete(), 5000)
                })

            } else {
                await userOverview.findOneAndUpdate(
                    {
                        guildId: guildId,
                        'users.userId': userId,
                        'users.dailyStats.date': today,
                    },
                    {
                        $inc: {
                            'users.$.dailyStats.$[inner].xpCount': randomXp,
                        },
                    },
                    {
                        new: true,
                        arrayFilters: [{ 'inner.date': today }],
                    }
                )
                cooldowns.add(message.author.id);
                setTimeout(() => {
                    cooldowns.delete(message.author.id)
                }, config.cooldown_xp)
            }
        } else {
            console.log('Serwera lub użytkownika nie ma w bazie danych');
            return;
        }
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do User Overview, Xp, Lvl: ${error}`);
    }
};