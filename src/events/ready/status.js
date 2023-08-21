const { ActivityType  } = require('discord.js')

module.exports = (client) => {
    let status = [
        {
            name: "Lux",
            type: ActivityType.Streaming,
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley'
        },
        {
            name: "Tenebris",
            type: ActivityType.Watching,
        }
        ,{
            name: "Lux In Tenebris",
            type: ActivityType.Listening,
        }
        ,{
            name: "SCP: Secret Laboratory",
            type: ActivityType.Playing,
        }
        ,{
            name: "Minecraft ;)",
            type: ActivityType.Playing,
        }
        ,{
            name: "Lux",
            type: ActivityType.Watching,
        }
        ,{
            name: "Tenebris",
            type: ActivityType.Listening,
        }
        ,{
            name: "Szanty",
            type: ActivityType.Listening,
        }
        ,{
            name: "The Walking Dead",
            type: ActivityType.Watching,
        }
        ,{
            name: "Soldier Of Heaven",
            type: ActivityType.Listening,

        }
    ]

    setInterval(() => {

        let random = Math.floor(Math.random() * status.length)
        client.user.setActivity(status[random])
        
    }, 100000);
}