# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install any needed packages specified in package.json
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
