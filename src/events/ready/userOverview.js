const userOverview = require('../../models/userOverviewModel');
const schedule = require('node-schedule');
const formatDate = require('../../functions/formatDate');

module.exports = async (client) => {
    try {
        schedule.scheduleJob('*/10 * * * * *', async () => {
            for (const [guildId, guild] of client.guilds.cache) {
                const today = formatDate(new Date());

                const fetchedUserOverview = await userOverview.findOne({
                    guildId: guildId,
                });

                if (fetchedUserOverview) {
                    const users = guild.members.cache.map(member => member.user);

                    users.forEach(async (user) => {
                        const userData = fetchedUserOverview.users.find(u => u.userId === user.id);
                        if (!userData) {
                            console.log('Brak danych dla użytkownika?');
                            return;
                        }

                        const todayStats = userData.dailyStats.find(stats => stats.date === today);

                        const { dailyStats } = userData;
                        const lastStats = dailyStats[dailyStats.length - 1];
                        const { xpCount, levelCount, balance,  warnCount } = lastStats;

                        if (!todayStats) {
                            await userOverview.findOneAndUpdate(
                                {
                                    guildId: guildId,
                                    'users.userId': user.id,
                                },
                                {
                                    $push: {
                                        'users.$[outer].dailyStats': {
                                            date: today,
                                            messageCount: 0,
                                            attachmentCount: 0,
                                            stickerCount: 0,
                                            linkCount: 0,
                                            userMentionCount: 0,
                                            roleMentionCount: 0,
                                            voiceChannelMinutes: 0,
                                            xpCount,
                                            levelCount,
                                            balance,
                                            warnCount
                                        },
                                    },
                                },
                                {
                                    new: true,
                                    arrayFilters: [{ 'outer.userId': user.id }],
                                }
                            );
                        }
                    });

                } else {
                    const newServerUsers = new userOverview({
                        guildId: guildId,
                        users: [],
                    });

                    const newDailyStats = {
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

                    async function fetchAndAddMembersToDatabase(guild, newServerUsers, newDailyStats) {
                        try {
                            const fetchedMembers = await guild.members.fetch();
                            const membersArray = fetchedMembers.map(member => member);
                    
                            membersArray.forEach(member => {
                                const newUser = {
                                    userId: member.user.id,
                                    userName: member.user.username,
                                    dailyStats: [], 
                                };
                                newUser.dailyStats.push(newDailyStats)
                                newServerUsers.users.push(newUser)
                            });
                    
                            await newServerUsers.save();
                            console.log(`Użytkownicy serwera o ID: ${guildId} zostali zapisani w bazie danych`);
                        } catch (error) {
                            console.error("Błąd podczas pobierania członków serwera i zapisu do bazy danych:", error);
                        }
                    }
                    
                    await fetchAndAddMembersToDatabase(guild, newServerUsers, newDailyStats);
                }
            }
            return;
         });
    } catch (error) {
        console.log(`Wystąpił błąd podczas zapisu danych do User Overview: ${error}`);
    }
};