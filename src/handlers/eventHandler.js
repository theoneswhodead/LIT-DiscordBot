const path = require('path')
const getAllFiles = require('../functions/getAllFiles')

module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true)

    eventFolders.forEach((eventFolder) => {
        const eventFiles = getAllFiles(eventFolder)
        eventFiles.sort((a,b) => a > b)

        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop()

        client.on(eventName, async (arg1, arg2) => {
            eventFiles.forEach( async (eventFile) => {
                const eventFunction = require(eventFile); 
                await eventFunction(client, arg1, arg2) 
            })
        })
    })
}
