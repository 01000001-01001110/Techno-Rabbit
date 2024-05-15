# Techno-Rabbit Discord Bot Setup, now with Modular Commands

This document provides detailed instructions and explanations on setting up a Discord bot with modular commands. The bot is connected to a MongoDB database and includes commands for playing games like rock-paper-scissors and managing welcome and goodbye messages.

## Folder Structure


bot/<br>
|-- commands/<br>
|   |-- setup_welcome.js<br>
|   |-- setup_goodbye.js<br>
|   |-- ping.js<br>
|   |-- rps.js<br>
|   |-- rpsls.js<br>
|-- bot.js<br>
|-- registerCommands.js<br>
|-- .env<br>


## Environment Setup

Create a `.env` file in the root directory with the following content:

\```
DISCORD_BOT_TOKEN=your_discord_bot_token<br>
DISCORD_APP_ID=your_discord_app_id<br>
MONGODB_URI=your_mongodb_uri<br>
\```

Replace `your_discord_bot_token`, `your_discord_app_id`, and `your_mongodb_uri` with your actual credentials.

## Main Bot File (`bot.js`)

The `bot.js` file is responsible for initializing the bot, connecting to MongoDB, and dynamically loading commands from the `commands` directory. It also includes handlers for various events such as member joins, member leaves, and command interactions.

### Key Points:

- **Database Connection:** Connects to MongoDB and attaches the database instance to `discordClient`.
- **Command Loading:** Dynamically loads command files from the `commands` directory into `discordClient.commands`.
- **Event Handlers:** Handles events like `guildMemberAdd`, `guildMemberRemove`, `guildCreate`, `guildDelete`, `error`, and `interactionCreate`.

## Command Registration File (`registerCommands.js`)

The `registerCommands.js` file reads all command files in the `commands` directory and registers them with Discord using the REST API.

### Key Points:

- **Reading Command Files:** Reads all `.js` files in the `commands` directory.
- **Registering Commands:** Uses the Discord REST API to register these commands with the bot's application ID.

## Command Files

### `commands/setup_welcome.js`

Sets up the welcome channel for the guild.

#### Key Points:

- **Permissions Check:** Ensures the user has `ADMINISTRATOR` permissions.
- **Channel Type Check:** Ensures the command is used in a guild text channel.
- **Database Update:** Updates the guild configuration in MongoDB to store the welcome channel ID.

### `commands/setup_goodbye.js`

Sets up the goodbye channel for the guild.

#### Key Points:

- **Permissions Check:** Ensures the user has `ADMINISTRATOR` permissions.
- **Channel Type Check:** Ensures the command is used in a guild text channel.
- **Database Update:** Updates the guild configuration in MongoDB to store the goodbye channel ID.

### `commands/ping.js`

Replies with "Pong!" and roundtrip times for the bot and API latency.

#### Key Points:

- **Bot Latency:** Calculates the time it takes for the bot to respond to a command.
- **API Latency:** Calculates the WebSocket ping time to Discord's API.

### `commands/rps.js`

Plays a game of rock-paper-scissors with the user.

#### Key Points:

- **User Choice:** Takes the user's choice of rock, paper, or scissors.
- **Bot Choice:** Randomly selects rock, paper, or scissors for the bot.
- **Result Calculation:** Determines the winner based on the choices.

### `commands/rpsls.js`

Plays a game of rock-paper-scissors-lizard-spock with the user.

#### Key Points:

- **User Choice:** Takes the user's choice of rock, paper, scissors, lizard, or Spock.
- **Bot Choice:** Randomly selects rock, paper, scissors, lizard, or Spock for the bot.
- **Result Calculation:** Determines the winner based on the choices and extended rules.

With these modular command files, you can easily manage and expand your bot's functionality while keeping the main file (`bot.js`) clean and organized.
