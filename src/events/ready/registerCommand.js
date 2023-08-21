const { REST, Routes } = require('discord.js')
const getCommands = require('../../functions/getCommands')
require('dotenv').config

module.exports = async (client) => {
    try {
        let commandsArr = []
        const commands = getCommands();

        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

        commands.forEach((command) => {
            commandsArr.push(command.data.toJSON())
        })
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
          { body: commandsArr }
        )
        console.log(`Rejestrowanie slash komend`)

    } catch (error) {
        console.log('Error podczas rejestracji komend: ', error)
    }
}
























