# Techno-Rabbit, Another Discord Bot's Documentation

![441520357_10161288801308427_5182253897433001652_n](https://github.com/01000001-01001110/Techno-Rabbit/assets/48245017/d21680a5-2714-4346-9a81-e919108010a9)

## Overview
The **[Techno-Rabbit](https://discord.com/oauth2/authorize?client_id=1238097527086120960&permissions=2147953824&scope=bot+applications.commands)** Bot is a Discord bot designed to send personalized welcome and goodbye messages to members as they join and leave a server. It uses a combination of predefined phrases to add a unique touch to each message. The bot also includes commands to play games like rock-paper-scissors and ping command functionality.
# Techno-Rabbit Bot Documentation

## Features

- **Welcome Messages:** Sends a custom welcome message when a new member joins the server.
- **Goodbye Messages:** Sends a custom goodbye message when a member leaves the server.
- **Customizable Channels:** Server administrators can set up separate channels for welcome and goodbye messages using specific commands.
- **Games and Utilities:** Includes commands for playing rock-paper-scissors, rock-paper-scissors-lizard-spock, and a ping command to check latency.

## Setup

Before you start using the bot, you need to set it up with the necessary Discord permissions and configure the environment variables.

### Permissions Required

- Guilds
- GuildMessages
- MessageContent
- GuildMembers
- DirectMessages

### Environment Variables

- `DISCORD_BOT_TOKEN`: The token used to authenticate your bot with Discord.
- `DISCORD_APP_ID`: The Discord app ID your bot uses. Used to register the slash commands.
- `MONGODB_URI`: The URI for connecting to your MongoDB database.

### Folder Structure

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


## Configuration

To configure the channels for welcome and goodbye messages, use the following slash commands in your server:

### Commands

- `/setup_welcome`: Sets the current channel as the welcome message channel.
- `/setup_goodbye`: Sets the current channel as the goodbye message channel.
- `/ping`: Checks the bot's latency.
- `/rps`: Play a game of rock-paper-scissors.
- `/rpsls`: Play a game of rock-paper-scissors-lizard-spock.

These commands must be run in the text channels where you want the bot to send welcome or goodbye messages. Ensure you have administrative permissions to use these commands.

## Usage

Once configured, the bot will automatically send messages in the designated channels:

- **Welcome Message Example:** 🎗️ Welcome to [Guild Name], you beautiful creature [Member Name]!
- **Goodbye Message Example:** Goodbye [Member Name]! We hope to see you again.

The messages include random phrases from predefined lists to make each greeting unique.

## Error Handling

The bot logs errors to the console if it encounters issues with reading the configuration file or sending messages. Ensure the bot has appropriate permissions and the channel IDs are correctly configured.

## Installation

To install the bot on your server, add it via the Discord OAuth2 flow with the necessary permissions. Ensure the environment variables are set correctly in your hosting environment.

## Source Code
The source code for the bot is maintained on GitHub. You can view and contribute to the code at [GitHub Repository](https://github.com/01000001-01001110/Techno-Rabbit).

## Support
For support, you can contact me through the GitHub issues page or via Discord at [My Discord Testing Server](https://discord.gg/8uCxNUmXe3).

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

### `commands/hangman.js`
#### Hangman

Adds a hangman game command.

**Key Points:**

- **Game Logic:** Implements the logic for playing hangman.
- **State Management:** Tracks the state of the game including guessed letters and remaining attempts.

### `commands/reminders.js`
#### Reminders

Adds a reminders command to set and manage reminders.

**Key Points:**

- **Time Management:** Allows users to set reminders for specific times.
- **Notifications:** Sends notifications when reminders are due.

### `commands/tictactoe.js`
#### Tic-Tac-Toe

Adds a tic-tac-toe game command.

**Key Points:**

- **Game Logic:** Implements the logic for playing tic-tac-toe.
- **Multiplayer:** Allows two users to play against each other.

### `commands/trivia.js`
#### Trivia

Adds slash commands for trivia games.

**Key Points:**

- **Interactive Gameplay:** Users can start trivia games directly in Discord.
- **Scoring:** Tracks scores for users participating in trivia games.

## Newly Created API to host trivia Questions

Fetch all questions.

**Request:**
```
curl -X GET http://localhost:3000/questions
```
**Request:**

#### 2. GET /questions/:id

Fetch a specific question by ID.

**Request:**

```
curl -X GET http://localhost:3000/questions/<id>
```

#### 3. POST /questions

Create a new question.

**Request:**

```
curl -X POST http://localhost:3000/questions
-H "Content-Type: application/json"
-d '{
"type": "multiple",
"difficulty": "medium",
"category": "History",
"question": "Joseph Stalin had a criminal past doing what?",
"correct_answer": "Robbing Trains",
"incorrect_answers": ["Murder for Hire", "Tax Evasion", "Identity Fraud"]
}'
```

#### 4. PUT /questions/:id

Update an existing question.

**Request:**

```
curl -X PUT http://localhost:3000/questions/<id>
-H "Content-Type: application/json"
-d '{
"type": "multiple",
"difficulty": "easy",
"category": "Science",
"question": "What is the chemical symbol for the element oxygen?",
"correct_answer": "O",
"incorrect_answers": ["O2", "Ox", "Oz"]
}'
```

#### 5. DELETE /questions/:id

Delete a question.

**Request:**

```
curl -X DELETE http://localhost:3000/questions/<id>
```

### MongoDB Setup in Docker for the Trivia Questions API
<br>
With these modular command files, it is much more easily managable and now able to expand the bot's functionality while keeping the main file (`bot.js`) clean and organized. At least that is the attempt.


<br>
<br>

# So you want to run the bot yourself? 
### Below are my Docker Deployment Instructions 

## Overview
This guide provides step-by-step instructions on how to containerize and deploy the Discord bot using Docker. Containerization with Docker ensures a consistent environment and simplifies deployment processes.

## Prerequisites
- Docker installed on your machine. [Install Docker](https://docs.docker.com/get-docker/)
- Basic understanding of Docker.

## Docker Setup

### Step 1: Create a Dockerfile
First, you need to create a Dockerfile in the root directory of your bot project. This Dockerfile will define the environment in which your bot will run.

```Dockerfile
# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variables
ENV DISCORD_BOT_TOKEN=your_bot_token_here
ENV DISCORD_APP_ID=your_app_id_here

# Run the bot when the container launches
CMD ["node", "bot.js"]
```

## Step 2: Build and Run the Docker Container
After setting up the Dockerfile, use the following commands to build and run your Docker container:

```bash
# Build the Docker image
docker build -t discord-bot .

# Run the Docker container
docker run -d --name my-discord-bot -e DISCORD_BOT_TOKEN='your_actual_bot_token' -e DISCORD_APP_ID='your_actual_app_id' discord-bot
```

Ensure you replace 'your_actual_bot_token' and 'your_actual_app_id' with your actual Discord bot token and application ID respectively. These environment variables are crucial for the bot to authenticate and function correctly.
