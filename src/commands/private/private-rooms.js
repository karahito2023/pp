const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('private-rooms')
        .setDescription("Создать приватные комнаты").setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(client, interaction) {
        let data = await client.db.guild.findOne({ guildId: interaction.guild.id });
        if (!data) {
            await client.db.guild.create({ guildId: interaction.guild.id });
        }
        let newdata = await client.db.guild.findOne({ guildId: interaction.guild.id });
        if (newdata?.private_voices?.categoryId && newdata?.private_voices?.channelId != null) {
            let btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('delete').setLabel('Удалить').setStyle(ButtonStyle.Danger))
            await interaction.deferReply().catch(() => null)
            let message = await interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.colors.default).setDescription('Система приватных комнат уже существует, удалить?')], components: [btn] })
            setTimeout(() => {
                interaction.editReply({ components: [] }).catch(() => null)
            }, 20 * 1000);
            let collector = message.createMessageComponentCollector()
            collector.on('collect', async (i) => {
                if (interaction.user.id != i.user.id) return i.deferUpdate().catcha(() => null);
                if (i.customId == 'delete') {
                    interaction.editReply({ components: [], content: `Система приватных комнат Удалена ✅` })
                    let data = await client.db.guild.findOne({ guildId: interaction.guild.id })
                    let channelId = await client.channels.fetch(data?.private_voices?.channelId).catch(() => null)
                    let textId = await client.channels.fetch(data?.private_voices?.textId).catch(() => null)
                    let categoryId = await client.channels.fetch(data?.private_voices?.categoryId).catch(() => null)
                    channelId?.delete().catch(() => null)
                    textId?.delete().catch(() => null)
                    categoryId?.delete().catch(() => null)
                    return await client.db.guild.updateOne({ guildId: interaction.guild.id }, {
                        $set: {
                            'private_voices': {}
                        }
                    })
                }
            })
        } else {
            let categoryId = await interaction.guild.channels.create({
                name: `Join To Create [+]`,
                type: ChannelType.GuildCategory,
            })
            let channelId = await interaction.guild.channels.create({
                name: `Create [+]`,
                type: ChannelType.GuildVoice,
                parent: categoryId,
                userLimit: 1,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        allow: [PermissionsBitField.Flags.Connect],
                        deny: [PermissionsBitField.Flags.Speak]
                    }
                ]
            })
            let textId = await interaction.guild.channels.create({
                name: `settigs`,
                parent: categoryId,
                topic: `Управление приватного канала`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.SendMessages]
                    }
                ]
            })
            // КНОПКИ УПРАВЛЕНИЯ
            const unlock = new ButtonBuilder().setCustomId("unlock").setEmoji(`1102314856289411102`).setStyle(ButtonStyle.Secondary)
            const lock = new ButtonBuilder().setCustomId("lock").setEmoji(`1102314857665147013`).setStyle(ButtonStyle.Secondary)
            const mute = new ButtonBuilder().setCustomId("mute").setEmoji(`1102314862866092052`).setStyle(ButtonStyle.Secondary)
            const unmute = new ButtonBuilder().setCustomId("unmute").setEmoji(`1102314861351927968`).setStyle(ButtonStyle.Secondary)
            const add = new ButtonBuilder().setCustomId("add").setEmoji(`1102314865105829959`).setStyle(ButtonStyle.Secondary)
            const remove = new ButtonBuilder().setCustomId("remove").setEmoji(`1102314866666119218`).setStyle(ButtonStyle.Secondary)
            const kick = new ButtonBuilder().setCustomId("kick").setEmoji(`1102314868067008632`).setStyle(ButtonStyle.Secondary)
            const owner = new ButtonBuilder().setCustomId("owner").setEmoji(`1102314870264840232`).setStyle(ButtonStyle.Secondary)
            const name = new ButtonBuilder().setCustomId("name").setEmoji(`1102314859191877746`).setStyle(ButtonStyle.Secondary)
            const limit = new ButtonBuilder().setCustomId("limit").setEmoji(`1102314917316526182`).setStyle(ButtonStyle.Secondary)

            let Buttons = new ActionRowBuilder().addComponents([unlock, lock, mute, unmute, add])
            let Buttons2 = new ActionRowBuilder().addComponents([remove, kick, owner, name, limit])

            let Embed = new EmbedBuilder().setAuthor({ name: 'Управление приватной комнатой', })
                .setDescription(
                    `
Для управления приватной комнатой используй следующие кнопки
Использовать их можно только когда у тебя есть приватный канал


<:unlock:1102314856289411102> ━ открыть комнату для всех.
<:lock:1102314857665147013> ━ закрыть комнату для всех.
<:mute:1102314862866092052> ━ забрать право говорить пользователю.
<:unmute:1102314861351927968> ━ выдать право говорить пользователю.
<:add:1102314865105829959> ━ выдать доступ в комнату пользователю.
<:remove:1102314866666119218> ━ забрать доступ к комнате у пользователя.
<:kick:1102314868067008632> ━ выгнать пользователя из комнаты.
<:owner:1102314870264840232> ━ сделать пользователя владельцем комнаты.
<:name:1102314859191877746> ━ изменить название комнаты.
<:limit:1102314917316526182> ━ изменить лимит пользователей.
                    `
                )
                .setColor(client.colors.default)
            textId.send({ embeds: [Embed], components: [Buttons, Buttons2] })
            await client.db.guild.updateOne({ guildId: interaction.guild.id }, {
                $set: {
                    'private_voices.mode': true,
                    'private_voices.categoryId': categoryId,
                    'private_voices.channelId': channelId,
                    'private_voices.textId': textId,
                }
            })

            await interaction.reply({ content: `Каналы успешно созданы.` })
        }
    }
}