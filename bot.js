require('dotenv').config();
const { MongoClient } = require('mongodb');
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

discordClient.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    discordClient.commands.set(command.data.name, command);
}

let db;

discordClient.once('ready', async () => {
    await client.connect();
    db = client.db('discordBot'); // Name of your database
    discordClient.db = db; // Attach the db to discordClient
    console.log(`Logged in as ${discordClient.user.tag} and connected to MongoDB!`);

    const guilds = discordClient.guilds.cache.map(guild => `${guild.name} (ID: ${guild.id})`);
    console.log(`The bot is currently in the following servers:\n${guilds.join('\n')}`);
});

const welcomePhrases = [
    "you beautiful creature",
    "Woah",
    "look at you joining",
    "hey superstar",
    "what an awesome surprise",
    "you made the right choice",
    "glad you're here",
    "just landed like a superstar",
    "ready to chat",
    "hopping into the server like"
];

const goodbyePhrases = [
    "We hope to see you again",
    "Until next time",
    "Safe travels",
    "Goodbye and good luck",
    "We'll miss you",
    "Come back soon",
    "It was nice having you here",
    "Farewell for now",
    "Hope you had a great time",
    "Don't be a stranger"
];

discordClient.on('guildMemberAdd', async member => {
    const config = await db.collection('guildConfigs').findOne({ guildId: member.guild.id });

    if (!config || !config.welcomeChannelId) {
        console.log("Welcome channel ID not configured.");
        return;
    }

    const guildName = member.guild.name;
    const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (welcomeChannel) {
        const randomPhrase = welcomePhrases[Math.floor(Math.random() * welcomePhrases.length)];
        welcomeChannel.send(`?? Welcome to ${guildName}, ${randomPhrase} ${member}!`);
    } else {
        console.log("Welcome channel not found");
    }
});

discordClient.on('guildMemberRemove', async member => {
    console.log(`Member leaving: ${member.displayName}`);

    const config = await db.collection('guildConfigs').findOne({ guildId: member.guild.id });

    if (!config || !config.goodbyeChannelId) {
        console.log("Goodbye channel ID not configured.");
        return;
    }

    const goodbyeChannel = member.guild.channels.cache.get(config.goodbyeChannelId);
    if (goodbyeChannel) {
        const randomPhrase = goodbyePhrases[Math.floor(Math.random() * goodbyePhrases.length)];
        goodbyeChannel.send(`Goodbye ${member.displayName}! ${randomPhrase}`)
            .then(() => console.log("Goodbye message sent."))
            .catch(error => console.log("Failed to send goodbye message:", error));
    } else {
        console.log("Goodbye channel not found");
    }
});

discordClient.on('guildCreate', async guild => {
    console.log(`Joined a new guild: ${guild.name} (ID: ${guild.id})`);

    let owner = await guild.fetchOwner();
    if (!owner) {
        console.log('Failed to fetch the guild owner.');
        return;
    }

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Hello, I am the new bot "Welcomer"!')
        .setDescription('To configure me, please use the `/setup_welcome` & `/setup_goodbye` command in the respective channel where you want me to send the welcome and goodbye messages.');

    try {
        await owner.send({ embeds: [embed] });
    } catch (error) {
        console.log('Failed to send message to owner:', error);
    }
});

discordClient.on('guildDelete', guild => {
    console.log(`Removed from a guild: ${guild.name} (ID: ${guild.id})`);
});

discordClient.on('error', error => {
    console.log('An error occurred:', error);
});

discordClient.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = discordClient.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);
