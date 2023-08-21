const getCommands = require('../../functions/getCommands')
require('dotenv').config

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const commands = getCommands();

    try {
        const command = commands.find((cmd) => cmd.data.name === interaction.commandName)

        if(!command) return;

        await command.execute(client, interaction)
    } catch (error) {
        console.log('Error podczas użycia komendy: ', error)
    }
}
