const { Client, IntentsBitField,} = require('discord.js')
const eventHandler = require('./handlers/eventHandler')
require('dotenv').config()
const mongoose = require('mongoose')

const client = new Client({
    intents: [ 
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
    ]
})


eventHandler(client);
(async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('Połączono z Bazą Danych');
        
		client.login(process.env.TOKEN);
	} catch (error) {
		console.log('Błąd przy logowaniu, łączeniu z bazą danych',error);
	}
})();