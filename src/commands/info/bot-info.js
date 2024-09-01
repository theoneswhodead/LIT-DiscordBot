const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('bot-info')
    .setDescription('Uzyskaj Informacje o Bocie.'),
  
	async execute(client, interaction) {

        if(!interaction.inGuild()){
            interaction.reply({ content: "Tą komendę możesz użyć tylko na serwerze Lux In Tenebris", ephermeral: true })
            return;
        } 

                const serverAvatar = interaction.guild.iconURL({ size: 256 })
                const botAvatar = interaction.client.user.displayAvatarURL()
				let year = new Date();
                const botName = interaction.client.user.username;

				const botInfoEmbed = new EmbedBuilder()
				.setColor(config.primaryColor)
				.setThumbnail(botAvatar)
                .setTimestamp()
                .addFields(
                    {
                        name: "Informacje o bocie:",
                        value: `**- Nazwa:** ${botName}
                        **- Stworzony dnia:** 04.10.2019
                        **- Dołączył na serwer:** 30.09.2020`
                    },
                    {
                        name: 'Stworzony:',
                        value: `Bot **${botName}** został stworzony przez **${config.createdBy}** na potrzeby serwera **GoldenLeague** [v1.3]. Zaktualizowany do wersji [v1.4] na potrzeby serwera **Lux In Tenebris**`
                    })
                .setFooter({ text: `© ${year.getFullYear()} ${interaction.guild.name}`, iconURL: serverAvatar})
                 
                 interaction.reply({embeds: [botInfoEmbed]})

	},
};
