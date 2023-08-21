const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const formatDate = require('../../functions/formatDate');
const config = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-info')
		.setDescription('Uzyskaj Informacje o serverze.'),

	async execute(client, interaction) {


        let year = new Date();
        const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const emojis = interaction.guild.emojis.cache.size;

        const serverName = interaction.guild.name;
       // const botName = interaction.client.user.username;
       // const botAvatar = interaction.client.user.displayAvatarURL()
        const serverAvatar = interaction.guild.iconURL({ size: 256 })
        //const currentChannel = interaction.channel;
       // const botCreated = formatDate(interaction.guild.createdAt);
        const serverCreated = formatDate(interaction.guild.createdTimestamp);
        const joined = formatDate(interaction.guild.joinedAt);

        const textChannels = interaction.guild.channels.cache.filter(channel => channel.type === 0).size;
        const voiceChannels = interaction.guild.channels.cache.filter(channel => channel.type === 2).size;

        const category = interaction.guild.channels.cache.filter(channel => channel.type === 4).size;


        const online = interaction.guild.members.cache.filter(member => member.presence?.status === "online").size;
        const idle = interaction.guild.members.cache.filter(member => member.presence?.status === 'idle').size;
        const dnd = interaction.guild.members.cache.filter(member => member.presence?.status === 'dnd').size;
        const offline = interaction.guild.members.cache.filter(member => member.presence?.status === 'offline').size;
        const bots = interaction.guild.members.cache.filter(member => member.user.bot).size;


				const serverInfoEmbed = new EmbedBuilder()
                .setTitle(serverName)
				.setColor(config.primaryColor)
				.setThumbnail(serverAvatar)
                .addFields(
                    {
                        name: "Informacje o serwerze:",
                        value: 
                        `**- ID serwera:** ${interaction.guild.id}
                        **- Poziom weryfikacji:** ${interaction.guild.verificationLevel}
                        **- Właściciel:** <@${interaction.guild.ownerId}>
                        **- Stworzony dnia:** ${serverCreated}
                        **- Dołączyłeś na serwer:** ${joined}`,
                        inline: true
                        
                    },
                    {
                        name: 'Statystyki serwera:',
                         value: 
                         `**- Ilość członków:** ${interaction.guild.memberCount}
                         **- Ilość kanałów tekstowych:** ${textChannels}
                         **- Ilość kanałów głosowych:** ${voiceChannels}
                         **- Ilość Kategorii:** ${category}
                         **- Ilość ról:** ${roles.length}
                         **- Ilość emoji:** ${emojis}
                         **- Ilość botów:** ${bots}
                         **- Ilość boostów:** ${interaction.guild.premiumSubscriptionCount || 0}`,
                         inline: true
                    },
                    {
                        name: "Stan członków:",
                        value: `**- Online:** ${online}
                        **- Zaraz wracam:** ${idle}
                        **- Nie przeszkadzać:** ${dnd}
                        **- Offline:** ${offline}`,
                        inline: true
                    },
                )
                .setTimestamp()
                .setFooter({ text: `© ${year.getFullYear()} ${interaction.guild.name}`, iconURL: serverAvatar})
                 
                await interaction.reply({embeds: [serverInfoEmbed]})
	},
};