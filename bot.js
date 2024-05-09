require('dotenv').config();
const fs = require('fs-extra'); 

const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, // Use StringSelectMenuBuilder instead of SelectMenuBuilder
    ChannelType 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
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

client.on('guildMemberAdd', async member => {
    let config;
    try {
        config = await fs.readJson('./channelConfig.json');
    } catch (error) {
        console.log('Error reading channel configuration:', error);
        return;
    }

    const welcomeChannelId = config[member.guild.id]?.welcomeChannelId;
    if (!welcomeChannelId) {
        console.log("Welcome channel ID not configured.");
        return;
    }

    const guildName = member.guild.name;
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
    if (welcomeChannel) {
        // Randomly select a phrase from the array
        const randomPhrase = welcomePhrases[Math.floor(Math.random() * welcomePhrases.length)];
        
        // Construct the message with the random phrase
        welcomeChannel.send(`🎗️ Welcome to ${guildName}, ${randomPhrase} ${member}!`);
    } else {
        console.log("Welcome channel not found");
    }
});

client.on('guildMemberRemove', async member => {
    console.log(`Member leaving: ${member.displayName}`);

    let config;
    try {
        config = await fs.readJson('./channelConfig.json');
        console.log('Configuration loaded:', config);
    } catch (error) {
        console.log('Error reading channel configuration:', error);
        return;
    }

    const goodbyeChannelId = config[member.guild.id]?.goodbyeChannelId;
    if (!goodbyeChannelId) {
        console.log("Goodbye channel ID not configured.");
        return;
    }

    const goodbyeChannel = member.guild.channels.cache.get(goodbyeChannelId);
    if (goodbyeChannel) {
        // Randomly select a phrase from the goodbyePhrases array
        const randomPhrase = goodbyePhrases[Math.floor(Math.random() * goodbyePhrases.length)];
        
        // Construct the message with the random phrase
        goodbyeChannel.send(`Goodbye ${member.displayName}! ${randomPhrase}`)
            .then(() => console.log("Goodbye message sent."))
            .catch(error => console.log("Failed to send goodbye message:", error));
    } else {
        console.log("Goodbye channel not found");
    }
});

client.on('guildCreate', async guild => {
    let owner = await guild.fetchOwner();
    if (!owner) {
        console.log('Failed to fetch the guild owner.');
        return;
    }

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Hello, I am the new bot "Techno-Rabbit"!')
        .setDescription('To configure me, please use the `/setup_welcome` & `/setup_goodbye` command in the respective channel where you want me to send the welcome and goodbye messages. If you run into any issue or have a suggestion you can add it [here:]('https://github.com/01000001-01001110/Techno-Rabbit/issues');

    try {
        await owner.send({ embeds: [embed] });
    } catch (error) {
        console.log('Failed to send message to owner:', error);
    }
});

client.on('error', error => {
    console.log('An error occurred:', error);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, channel } = interaction;

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        await interaction.reply({ content: 'You need administrator permissions to run this command!', ephemeral: true });
        return;
    }

    if (!channel || channel.type !== ChannelType.GuildText) {
        await interaction.reply({ content: 'This command can only be used in a server text channel.', ephemeral: true });
        return;
    }

    let configKey;
    if (commandName === 'setup_welcome') {
        configKey = 'welcomeChannelId';
    } else if (commandName === 'setup_goodbye') {
        configKey = 'goodbyeChannelId';
    } else {
        return;
    }

    const filePath = './channelConfig.json';
    let config = {};
    try {
        config = await fs.readJson(filePath);
    } catch (error) {
        console.log('No existing configuration file, creating a new one.');
    }

    // Update the configuration for the specific channel
    if (!config[interaction.guild.id]) {
        config[interaction.guild.id] = {};
    }
    config[interaction.guild.id][configKey] = channel.id;
    await fs.writeJson(filePath, config, { spaces: 4 });
    console.log('Channel configuration saved.');

    await interaction.reply({ content: `Setup complete! The ${commandName.split('_')[1]} channel has been set to this channel: ${channel.name}`, ephemeral: true });
});

client.login(process.env.DISCORD_BOT_TOKEN);
