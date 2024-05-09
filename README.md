# Techno-Rabbit, Another Discord Bot's Documentation

![441520357_10161288801308427_5182253897433001652_n](https://github.com/01000001-01001110/Techno-Rabbit/assets/48245017/d21680a5-2714-4346-9a81-e919108010a9)

## Overview
The **[Techno-Rabbit](https://discord.com/oauth2/authorize?client_id=1238097527086120960&permissions=2147953824&scope=bot+applications.commands)** Bot is currently a Discord bot designed to send personalized welcome and goodbye messages to members as they join and leave a server. It uses a combination of predefined phrases to add a unique touch to each message.

## Features
- **Welcome Messages**: Sends a custom welcome message when a new member joins the server.
- **Goodbye Messages**: Sends a custom goodbye message when a member leaves the server.
- **Customizable Channels**: Server administrators can set up separate channels for welcome and goodbye messages using specific commands.

## Setup
Before you start using the bot, you need to set it up with the necessary Discord permissions and configure the environment variables.

### Permissions Required
- `Guilds`
- `GuildMessages`
- `MessageContent`
- `GuildMembers`
- `DirectMessages`

### Environment Variables
- `DISCORD_BOT_TOKEN`: The token used to authenticate your bot with Discord.
- `DISCORD_APP_ID`: The Discord appID your bot uses. Used to register the slash commands.

## Configuration
To configure the channels for welcome and goodbye messages, use the following slash commands in your server:

### Commands
- `/setup_welcome`: Sets the current channel as the welcome message channel.
- `/setup_goodbye`: Sets the current channel as the goodbye message channel.

These commands must be run in the text channels where you want the bot to send welcome or goodbye messages. Ensure you have administrative permissions to use these commands.

## Usage
Once configured, the bot will automatically send messages in the designated channels:

- **Welcome Message Example**: 🎗️ Welcome to [Guild Name], you beautiful creature [Member Name]!
- **Goodbye Message Example**: Goodbye [Member Name]! We hope to see you again.

The messages include random phrases from predefined lists to make each greeting unique.

## Error Handling
The bot logs errors to the console if it encounters issues with reading the configuration file or sending messages. Ensure the bot has appropriate permissions and the channel IDs are correctly configured.

## Installation
To install the bot on your server, add it via the Discord OAuth2 flow with the necessary permissions. Ensure the environment variables are set correctly in your hosting environment.

## Source Code
The source code for the bot is maintained on GitHub. You can view and contribute to the code at [GitHub Repository](https://github.com/01000001-01001110/Techno-Rabbit).

## Support
For support, you can contact the me team through the GitHub issues page or via Discord at [My Discord Testing Server](https://discord.gg/8uCxNUmXe3).

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
