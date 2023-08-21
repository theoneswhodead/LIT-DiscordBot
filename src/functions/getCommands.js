const path = require('path')
const getAllFiles = require('./getAllFiles')

module.exports = () => {
    let commands = [];

    const commandCategories = getAllFiles(
        path.join(__dirname, '..', 'commands'),
        true 
    )

    commandCategories.forEach((commandCategory) => {
        const commandFiles = getAllFiles(commandCategory)

        commandFiles.forEach((commandFile) => {
            const command = require(commandFile);

            commands.push(command)
        })
    })
    return commands;
}