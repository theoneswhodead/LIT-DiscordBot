const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('add-roles-choice')
    .setDescription('Dodaj wybór ról na kanał.'),
  
	async execute(client, interaction) {

        if(!interaction.inGuild()){
            interaction.reply({ content: "Tą komendę możesz użyć tylko na serwerze Lux In Tenebris", ephermeral: true })
            return;
        }

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return await interaction.reply({ content: 'Nie masz uprawnień' }).then(m => {
                setTimeout(() => m.delete(), 5000)
            })
        }
                 const serverAvatar = interaction.guild.iconURL({ size: 256 })
				let year = new Date();

                const RoleEmbed = new EmbedBuilder()
                .setColor(0x9e0000)
                .setDescription('**Wybierz swoją rangę:**')

                const row = new ActionRowBuilder();

                config.roles.forEach((role) => {
                    row.components.push(
                        new ButtonBuilder()
                        .setCustomId(role.id)
                        .setLabel(role.label)
                        .setStyle(ButtonStyle.Primary)
                    )
                })

                const row2 = new ActionRowBuilder();

                config.roles2.forEach((role) => {
                    row2.components.push(
                        new ButtonBuilder()
                        .setCustomId(role.id)
                        .setLabel(role.label)
                        .setStyle(ButtonStyle.Primary)
                    )
                })

                interaction.reply({
                    embeds: [RoleEmbed],
                    components: [row, row2],
                })

	},
};