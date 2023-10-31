const { EmbedBuilder } = require('discord.js');

const config = require('../../../config.json');
const userOverview = require('../../models/userOverviewModel');
const formatDate = require('../../functions/formatDate');

module.exports = async (client, interaction) => {
    try {
        if(!interaction.isButton()) return;
    
        await interaction.deferReply({ephemeral: true})
     
        const role = interaction.guild.roles.cache.get(interaction.customId)
        let requiredLevel = 0;
        const userId = interaction.member.id;
        const today = formatDate(new Date());
        const guildId = interaction.guild.id;
        const hasRole = interaction.member.roles.cache.has(role.id)
        const serverAvatar = interaction.guild.iconURL({ size: 256 })
        const botAvatar = interaction.member.user.displayAvatarURL()
        let year = new Date();
      
        if(!role) {
             interaction.editReply({ 
                 content: 'Nie mogę znaleźć takiej roli',
             })
             return;
        }
     
        if(hasRole) {
            const roleRemoveEmbed = new EmbedBuilder()
            .setColor(config.primaryColor)
            .setThumbnail(botAvatar)
            .setTimestamp()
            .addFields(
                {
                    name: "Rola:",
                    value: `**${role}** została zabrana`
                })
            .setFooter({ text: `© ${year.getFullYear()} ${interaction.guild.name}`, iconURL: serverAvatar})

             await interaction.member.roles.remove(role)
             await interaction.editReply({embeds: [roleRemoveEmbed]})
             return;
        }

        config.roles.forEach(role => {
            if (role.id === interaction.customId) {
                requiredLevel = role.level;
            }
        });

        const fetchedUserOverview = await userOverview.findOne({
            guildId: guildId,
            'users.userId': userId,
        });

        if(fetchedUserOverview) {
            const userStats = fetchedUserOverview.users.find(user => user.userId === userId)
            const dailyStatsToday = userStats.dailyStats.find(stats => stats.date === today)
            
            let levelCount = dailyStatsToday.levelCount

            if(levelCount >= requiredLevel) {

                const roleAddEmbed = new EmbedBuilder()
				.setColor(config.primaryColor)
				.setThumbnail(botAvatar)
                .setTimestamp()
                .addFields(
                    {
                        name: "Rola:",
                        value: `**${role}** została dodana`
                    })
                .setFooter({ text: `© ${year.getFullYear()} ${interaction.guild.name}`, iconURL: serverAvatar})

                await interaction.member.roles.add(role)
                await interaction.editReply({embeds: [roleAddEmbed]})
            } else {
                const levelRequiredEmbed = new EmbedBuilder()
				.setColor(config.primaryColor)
				.setThumbnail(botAvatar)
                .setTimestamp()
                .addFields(
                    {
                        name: "Rola:",
                        value: `**${role}** wymaga **${requiredLevel}** levela, Ty masz **${levelCount}** level`
                    })
                .setFooter({ text: `© ${year.getFullYear()} ${interaction.guild.name}`, iconURL: serverAvatar})
                await interaction.editReply({embeds: [levelRequiredEmbed]})
            }
        }  
    } catch (error) {
        console.log(error)
    }
}