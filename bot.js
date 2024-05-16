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
    db = client.db('discordBot');
    discordClient.db = db;
    console.log(`Logged in as ${discordClient.user.tag} and connected to MongoDB!`);

    const guilds = discordClient.guilds.cache.map(guild => `${guild.name} (ID: ${guild.id})`);
    console.log(`The bot is currently in the following servers:\n${guilds.join('\n')}`);
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

// Existing welcome and goodbye event handlers
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
        welcomeChannel.send(`Welcome to ${guildName}, ${randomPhrase} ${member}!`);
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

// Periodic check for reminders that need to be triggered
const checkReminders = async () => {
    const now = Date.now();
    const reminders = await discordClient.db.collection('reminders').find({ triggerTime: { $lte: now } }).toArray();

    for (const reminder of reminders) {
        const channel = await discordClient.channels.fetch(reminder.channelId);
        if (channel) {
            channel.send(`<@${reminder.userId}> Reminder: ${reminder.message}`);
        }
        await discordClient.db.collection('reminders').deleteOne({ _id: reminder._id });
    }
};

setInterval(checkReminders, 60000); // Check every minute

// Add game handling
discordClient.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Trivia game handling
    if (discordClient.triviaAnswer && message.content.toLowerCase() === discordClient.triviaAnswer.toLowerCase()) {
        message.channel.send(`${message.author}, correct answer!`);
        discordClient.triviaScore++;
    } else if (discordClient.triviaQuestions && discordClient.triviaCurrentQuestion !== undefined) {
        message.channel.send(`${message.author}, wrong answer. The correct answer was: ${discordClient.triviaAnswer}`);
        discordClient.triviaCurrentQuestion++;
        if (discordClient.triviaCurrentQuestion < discordClient.triviaQuestions.length) {
            const question = discordClient.triviaQuestions[discordClient.triviaCurrentQuestion];
            const choices = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

            let options = '';
            choices.forEach((choice, index) => {
                options += `\n${String.fromCharCode(65 + index)}: ${choice}`;
            });

            message.channel.send({
                content: `**${question.category}**\n${question.question}${options}`
            });

            discordClient.triviaAnswer = question.correct_answer;
        } else {
            message.channel.send(`Game over! You scored ${discordClient.triviaScore} out of ${discordClient.triviaQuestions.length}.`);
            discordClient.triviaQuestions = null;
            discordClient.triviaCurrentQuestion = undefined;
            discordClient.triviaScore = undefined;
            discordClient.triviaAnswer = undefined;
        }
    }

    // Hangman game handling
    if (discordClient.hangmanWord) {
        const guess = message.content.toLowerCase();
        if (guess.length === 1 && /[a-z]/.test(guess)) {
            if (discordClient.hangmanGuesses.includes(guess)) {
                message.channel.send(`You already guessed '${guess}'.`);
                return;
            }

            discordClient.hangmanGuesses.push(guess);

            if (discordClient.hangmanWord.includes(guess)) {
                message.channel.send(`Correct guess: '${guess}'`);
            } else {
                discordClient.hangmanAttempts--;
                message.channel.send(`Wrong guess: '${guess}'. Attempts left: ${discordClient.hangmanAttempts}`);
            }

            const displayWord = discordClient.hangmanWord.map(letter => discordClient.hangmanGuesses.includes(letter) ? letter : '_').join(' ');

            if (!displayWord.includes('_')) {
                message.channel.send(`Congratulations, you won! The word was '${discordClient.hangmanWord.join('')}'.`);
                discordClient.hangmanWord = null;
            } else if (discordClient.hangmanAttempts === 0) {
                message.channel.send(`Game over! The word was '${discordClient.hangmanWord.join('')}'.`);
                discordClient.hangmanWord = null;
            } else {
                message.channel.send(`Word: ${displayWord}`);
            }
        }
    }

    // Tic-Tac-Toe game handling
    if (discordClient.tictactoe) {
        const { board, currentPlayer, opponent, nextTurn, moves } = discordClient.tictactoe;
        const user = message.author;

        if (user.id !== currentPlayer.id && user.id !== opponent.id) return;
        if (user.id !== nextTurn.id) {
            message.channel.send(`It's not your turn, ${user}.`);
            return;
        }

        const move = message.content.split(',');
        if (move.length !== 2) return;

        const [row, col] = move.map(Number);
        if (isNaN(row) || isNaN(col) || row < 0 || row > 2 || col < 0 || col > 2 || board[row][col] !== ' ') {
            message.channel.send(`Invalid move! Use format 'row,col' where row and col are between 0 and 2, and the cell is empty.`);
            return;
        }

        board[row][col] = user.id === currentPlayer.id ? 'X' : 'O';
        discordClient.tictactoe.moves++;

        message.channel.send(`${user} made a move:\n${printBoard(board)}`);

        const winner = checkWinner(board);
        if (winner) {
            message.channel.send(`Game over! ${user} wins!`);
            discordClient.tictactoe = null;
        } else if (discordClient.tictactoe.moves === 9) {
            message.channel.send(`Game over! It's a draw!`);
            discordClient.tictactoe = null;
        } else {
            discordClient.tictactoe.nextTurn = user.id === currentPlayer.id ? opponent : currentPlayer;
        }
    }
});

const printBoard = (board) => {
    return board.map(row => row.join(' | ')).join('\n---------\n');
};

const checkWinner = (board) => {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== ' ') return board[i][0];
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== ' ') return board[0][i];
    }
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== ' ') return board[0][0];
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== ' ') return board[0][2];
    return null;
};

discordClient.login(process.env.DISCORD_BOT_TOKEN);
