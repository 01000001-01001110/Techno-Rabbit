const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rpsls')
        .setDescription('Play a game of rock-paper-scissors-lizard-spock')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Your choice')
                .setRequired(true)
                .addChoices(
                    { name: 'Rock', value: 'rock' },
                    { name: 'Paper', value: 'paper' },
                    { name: 'Scissors', value: 'scissors' },
                    { name: 'Lizard', value: 'lizard' },
                    { name: 'Spock', value: 'spock' }
                )),
    async execute(interaction) {
        const userChoice = interaction.options.getString('choice');
        const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result;
        const winConditions = {
            rock: ['scissors', 'lizard'],
            paper: ['rock', 'spock'],
            scissors: ['paper', 'lizard'],
            lizard: ['paper', 'spock'],
            spock: ['rock', 'scissors']
        };

        if (userChoice === botChoice) {
            result = "It's a tie!";
        } else if (winConditions[userChoice].includes(botChoice)) {
            result = 'You win!';
        } else {
            result = 'You lose!';
        }

        await interaction.reply(`You chose ${userChoice}. I chose ${botChoice}. ${result}`);
    },
};
