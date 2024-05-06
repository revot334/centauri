const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Guild } = require('../../src/database/models')


module.exports = {
    name: 'Config',
    description: 'Config the bot for your server',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'AutoMod-Module',
            description: 'Setup the Auto Moderation Module',
            type: ApplicationCommandOptionType.SubCommand,
            options: [
                {
                    name: 'automod-alerts-channel',
                    description: 'The channel to send Auto moderation alerts to',
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                } 
            ]
        }, 
        {
            name: 'Welcome-Module',
            description: 'Setup the welcome Module',
            options: [
                {
                    name: 'welcome-channel',
                    description: 'The channel to send welcome messages to',
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                },
                {
                    name: 'welcome-message',
                    description: 'The message to send to new members',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                }

            ]
        }
    
       
    ],
    async execute({ interaction }) {

        let GuildData = await Guild.findOne({ GuildId: interaction.guildid })
        if (!GuildData) { 
            const newGuild = new Guild({
                GuildId: interaction.guildid,
            })
            await newGuild.save()
            GuildData = await Guild.findOne({ GuildId: interaction.guildid })
        }
        switch(interaction.options.getSubcommand()) {

            case 'AutoMod-Module': {
                const channel = interaction.options.getChannel('automod-alerts-channel')
                if (channel) {
                if (channel.type !== 'GUILD_TEXT') return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | The channel must be a text channel`)], ephemeral: true, })
                GuildData.AutoMod.AlertsChannel = channel.id
                await GuildData.save()
                return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | AutoMod alerts channel set to <#${channel.id}>`)], ephemeral: true, })
                } else {
                    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | No Input, please select an Input!`)], ephemeral: true, })
                } 
            }
            case 'Welcome-Module': {
                const channel = interaction.options.getChannel('welcome-channel')
                const message = interaction.options.getString('welcome-message')
                if (channel) {
                if (channel.type !== 'GUILD_TEXT') return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | The channel must be a text channel`)], ephemeral: true, })
                GuildData.Welcome.channelId = channel.id
                await GuildData.save()
                return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | Welcome channel set to <#${channel.id}>`)], ephemeral: true, })
                }
                if (message) {
                    if (message.length > 1024) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | The message is too long, please keep it under 1024 characters`)], ephemeral: true, })
                    GuildData.Welcome.WelcomeMessage = message
                    await GuildData.save()
                    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | Welcome message set to ${message}`)], ephemeral: true, })
                }
                else {
                    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | No Input, please select an Input!`)], ephemeral: true, })
                }
            }



        } 
    }}
