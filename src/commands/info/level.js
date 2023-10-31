const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord')
const userOverview = require('../../models/userOverviewModel');
const formatDate = require('../../functions/formatDate');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Informacje o Levelu')
    .addUserOption(option => option
        .setName('target')
        .setDescription('Kogo lvl sprawdzić?')
        .setRequired(false)),
  
	async execute(client, interaction) {

        if(!interaction.inGuild()){
            interaction.reply({ content: "Tą komendę możesz użyć tylko na serwerze Lux In Tenebris", ephermeral: true })
            return;
        } 
        await interaction.deferReply();

        const mentionUserId = interaction.options.get('target')?.value;

        const userId = mentionUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(userId)
        const today = formatDate(new Date());
        const guildId = interaction.guild.id;
      
        const fetchedUserOverview = await userOverview.findOne({
            guildId: guildId,
            'users.userId': userId,
        });

        if (fetchedUserOverview) {

            const userStats = fetchedUserOverview.users.find(user => user.userId === userId)
            const dailyStatsToday = userStats.dailyStats.find(stats => stats.date === today)
            
            let xpCount = dailyStatsToday.xpCount
            let levelCount = dailyStatsToday.levelCount


            let allLevels = await userOverview.find({
                guildId: guildId,
                'users.dailyStats.date': today,
            });

    allLevels.forEach(level => {
        level.users.sort((a, b) => {
        if (a.dailyStats[a.dailyStats.length - 1].levelCount === b.dailyStats[b.dailyStats.length - 1].levelCount) {
            return b.dailyStats[b.dailyStats.length - 1].xpCount - a.dailyStats[a.dailyStats.length - 1].xpCount;
        } else {
            return b.dailyStats[b.dailyStats.length - 1].levelCount - a.dailyStats[a.dailyStats.length - 1].levelCount;
        }
        });
    });
  
    let userRank = 0;
    allLevels.forEach((level, index) => {
        const userIndex = level.users.findIndex(user => user.userId === userId);
        if (userIndex !== -1) {
        userRank = index + userIndex + 1;
        }
    });
  
    const status = targetUserObj.presence?.status || 'offline';

            const rank = new canvacord.Rank()
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
             .setRank(userRank)
            .setLevel(levelCount)
            .setCurrentXP(xpCount)
            .setRequiredXP((10 * (levelCount * levelCount) + 100 || 1))
            .setStatus(status, true, 5)
            .setProgressBar('#9e0000', 'COLOR', true)
            .setProgressBarTrack('#000')
            .setRankColor('#9e0000')
            .setLevelColor('9e0000')
            .setUsername(targetUserObj.user.username, '#9e0000')
            .setDiscriminator(targetUserObj.user.setDiscriminator)
            .setOverlay('#000')

            const data = await rank.build();
            const attachment = new AttachmentBuilder(data);
            interaction.editReply({ files: [attachment] })

        } else {
            interaction.editReply(
                mentionUserId ? `${targetUserObj.user.tag} Nie ma jeszcze Levelu` : `Nie masz jeszcze Levelu`
            )
            return;
        }
	},
};