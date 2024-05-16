const { SlashCommandBuilder } = require('@discordjs/builders');
const { setTimeout } = require('timers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reminder')
        .setDescription('Set a reminder')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time until the reminder (e.g., 10s, 5m, 2h, 1d)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Reminder message')
                .setRequired(true)),
    async execute(interaction) {
        const timeString = interaction.options.getString('time');
        const message = interaction.options.getString('message');

        // Convert timeString to milliseconds
        const timeUnits = {
            s: 1000,
            m: 60000,
            h: 3600000,
            d: 86400000
        };
        const timeValue = parseInt(timeString.slice(0, -1));
        const timeUnit = timeString.slice(-1);
        const timeInMs = timeValue * (timeUnits[timeUnit] || 0);

        if (!timeInMs || isNaN(timeValue) || !timeUnits[timeUnit]) {
            await interaction.reply({
                content: 'Invalid time format. Use the following format: `10s` for seconds, `5m` for minutes, `2h` for hours, `1d` for days. Examples: `/reminder time:10s message:Take a break!`, `/reminder time:5m message:Check the oven!`, `/reminder time:2h message:Meeting time!`, `/reminder time:1d message:Project deadline!`',
                ephemeral: true
            });
            return;
        }

        // Save the reminder to the database
        const reminder = {
            userId: interaction.user.id,
            channelId: interaction.channel.id,
            message: message,
            triggerTime: Date.now() + timeInMs
        };

        const result = await interaction.client.db.collection('reminders').insertOne(reminder);
        await interaction.reply({ content: `Reminder set for ${timeValue}${timeUnit}: ${message}`, ephemeral: true });

        // Schedule the reminder
        setTimeout(async () => {
            const channel = await interaction.client.channels.fetch(reminder.channelId);
            if (channel) {
                channel.send(`<@${reminder.userId}> Reminder: ${reminder.message}`);
            }
            await interaction.client.db.collection('reminders').deleteOne({ _id: result.insertedId });
        }, timeInMs);
    }
};
