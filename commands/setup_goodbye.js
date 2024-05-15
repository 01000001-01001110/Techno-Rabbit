const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup_goodbye')
        .setDescription('Setup the goodbye channel'),
    async execute(interaction) {
        const { channel, guild, member } = interaction;

        if (!member.permissions.has('ADMINISTRATOR')) {
            await interaction.reply({ content: 'You need administrator permissions to run this command!', ephemeral: true });
            return;
        }

        if (!channel || channel.type !== ChannelType.GuildText) {
            await interaction.reply({ content: 'This command can only be used in a server text channel.', ephemeral: true });
            return;
        }

        const configKey = 'goodbyeChannelId';

        const guildConfig = await interaction.client.db.collection('guildConfigs').findOne({ guildId: guild.id }) || { guildId: guild.id };
        guildConfig[configKey] = channel.id;

        await interaction.client.db.collection('guildConfigs').updateOne(
            { guildId: guild.id },
            { $set: guildConfig },
            { upsert: true }
        );

        await interaction.reply({ content: `Setup complete! The goodbye channel has been set to this channel: ${channel.name}`, ephemeral: true });
    },
};
