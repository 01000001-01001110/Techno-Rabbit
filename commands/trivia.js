const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Get a random trivia question'),
    async execute(interaction) {
        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(`http://localhost:3000/questions`);
            const data = await response.json();

            if (data.length > 0 && data[0].results.length > 0) {
                // Pick a random question from the database
                const randomQuestionIndex = Math.floor(Math.random() * data[0].results.length);
                const question = data[0].results[randomQuestionIndex];

                const choices = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

                let options = '';
                const choiceMap = {};
                choices.forEach((choice, index) => {
                    const letter = String.fromCharCode(65 + index); // A, B, C, D...
                    options += `\n${letter}: ${choice}`;
                    choiceMap[letter] = choice.toLowerCase(); // Map letter to choice for quick lookup
                });

                await interaction.reply({
                    content: `**${question.category}**\n${question.question}${options}`,
                    ephemeral: true
                });

                interaction.client.triviaAnswer = question.correct_answer.toLowerCase();

                const filter = response => {
                    const userAnswer = response.content.trim().toLowerCase();
                    const letterAnswer = choiceMap[userAnswer.toUpperCase()];
                    return response.author.id === interaction.user.id && (userAnswer === interaction.client.triviaAnswer || letterAnswer === interaction.client.triviaAnswer);
                };

                interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const response = collected.first();
                        response.reply(`${response.author}, correct answer!`);
                    })
                    .catch(collected => {
                        interaction.followUp(`Time's up! The correct answer was: ${question.correct_answer}`);
                    });
            } else {
                await interaction.reply({
                    content: 'No trivia questions found. Please try again later.',
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Failed to fetch trivia questions. Please try again later.',
                ephemeral: true
            });
        }
    }
};
