const { SlashCommandBuilder } = require('@discordjs/builders');

const words = ['javascript', 'discord', 'bot', 'nodejs', 'programming'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Start a game of Hangman'),
    async execute(interaction) {
        const word = words[Math.floor(Math.random() * words.length)];
        interaction.client.hangmanWord = word.split('');
        interaction.client.hangmanGuesses = [];
        interaction.client.hangmanAttempts = 6;

        let displayWord = interaction.client.hangmanWord.map(letter => '_').join(' ');
        await interaction.reply(`Word: ${displayWord}\nAttempts left: ${interaction.client.hangmanAttempts}`);
    }
};
