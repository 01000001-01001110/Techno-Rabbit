const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Start a game of Tic-Tac-Toe')
        .addUserOption(option => option.setName('opponent').setDescription('The opponent').setRequired(true)),
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');
        const board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];

        interaction.client.tictactoe = {
            board,
            currentPlayer: interaction.user,
            opponent,
            nextTurn: opponent,
            moves: 0
        };

        await interaction.reply(`Tic-Tac-Toe game started! ${interaction.user} vs ${opponent}\n${printBoard(board)}`);
    }
};

const printBoard = (board) => {
    return board.map(row => row.join(' | ')).join('\n---------\n');
};
