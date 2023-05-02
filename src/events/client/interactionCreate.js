const { Collection, InteractionType, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const cooldowns = new Collection()
module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (interaction.isButton()) {
            if (!await client.db.user.findOne({ guildId: interaction.guild.id, userId: interaction.user.id })) await client.db.user.create({ guildId: interaction.guild.id, userId: interaction.user.id });
            const data = await client.db.guild.findOne({ guildId: interaction.guild.id })
            const userdata = await client.db.user.findOne({ guildId: interaction.guild.id, userId: interaction.user.id })
            if (userdata?.private_voices?.voiceId != null) {
                const channel = await interaction.guild.channels.fetch(userdata?.private_voices?.voiceId).catch(() => null)
                if (!channel) {
                    await client.db.user.updateOne({ guildId: interaction.guild.id, userId: interaction.user.id }, {
                        $set: {
                            "private_voices.voiceId": null
                        }
                    })
                    return interaction.reply({ content: `> Ваша комната не найдена.`, ephemeral: true }).catch(() => null)
                }
                if (!interaction.member.voice.channel) {
                    await client.db.user.updateOne({ guildId: interaction.guild.id, userId: interaction.user.id }, {
                        $set: {
                            "private_voices.voiceId": null
                        }
                    })
                    return interaction.reply({ content: `> Вы не находитесь в своей комнате.`, ephemeral: true }).catch(() => null)
                }
                if (interaction.customId == "unlock") {
                    if (userdata?.private_voices?.lock == true) {
                        await client.db.user.updateOne({ guildId: interaction.guild.id, userId: interaction.user.id },
                            {
                                $set: {
                                    "private_voices.lock": false
                                }
                            })
                        await interaction.member.voice.channel.permissionOverwrites.create(interaction.guild.id, { Connect: true }).catch(() => null)
                        await interaction.reply({ content: `<:unlock:1102314856289411102> Комната была открыта`, ephemeral: true }).catch(() => null)
                    } else {
                        interaction.reply({ content: `> Комната не закрыта`, ephemeral: true }).catch(() => null)
                    }
                }
                if (interaction.customId == "lock") {
                    if (userdata?.private_voices?.lock == false) {
                        await client.db.user.updateOne({ guildId: interaction.guild.id, userId: interaction.user.id },
                            {
                                $set: {
                                    "private_voices.lock": true
                                }
                            })
                        await interaction.member.voice.channel.permissionOverwrites.create(interaction.guild.id, { Connect: false }).catch(() => null)
                        await interaction.reply({ content: `<:lock:1102314857665147013> Комната была закрыта`, ephemeral: true }).catch(() => null)
                    } else {
                        interaction.reply({ content: `> Комната уже закрыта`, ephemeral: true }).catch(() => null)
                    }
                }
                if (interaction.customId == "mute") {
                    const Modal = new ModalBuilder()
                        .setCustomId("mute_mod")
                        .setTitle("Замутить пользователя")
                    const Input = new TextInputBuilder()
                        .setCustomId("mute_mod_int")
                        .setPlaceholder(`${interaction.user.id}`)
                        .setLabel("напишите айди пользователя")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(32)
                    Modal.addComponents(new ActionRowBuilder().addComponents(Input))
                    await interaction.showModal(Modal)
                }
                if (interaction.customId == "unmute") {
                    const Modal = new ModalBuilder()
                        .setCustomId("unmute_mod")
                        .setTitle("Размутить пользователя")
                    const Input = new TextInputBuilder()
                        .setCustomId("unmute_mod_int")
                        .setPlaceholder(`${interaction.user.id}`)
                        .setLabel("напишите айди пользователя")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(32)
                    Modal.addComponents(new ActionRowBuilder().addComponents(Input))
                    await interaction.showModal(Modal)
                }
                if (interaction.customId == "kick") {
                    const Modal = new ModalBuilder()
                        .setCustomId("kick_mod")
                        .setTitle("Выгнать пользователя")
                    const Input = new TextInputBuilder()
                        .setCustomId("kick_mod_int")
                        .setPlaceholder(`${interaction.user.id}`)
                        .setLabel("напишите айди пользователя")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(32)
                    Modal.addComponents(new ActionRowBuilder().addComponents(Input))
                    await interaction.showModal(Modal)
                }
                if (interaction.customId == "add") {
                    const Modal = new ModalBuilder()
                        .setCustomId("add_mod")
                        .setTitle("Выдать доступ пользователю")
                    const Input = new TextInputBuilder()
                        .setCustomId("add_mod_int")
                        .setPlaceholder(`${interaction.user.id}`)
                        .setLabel("напишите айди пользователя")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(32)
                    Modal.addComponents(new ActionRowBuilder().addComponents(Input))
                    await interaction.showModal(Modal)
                }
                if (interaction.customId == "remove") {
                    const Modal = new ModalBuilder()
                        .setCustomId("remove_mod")
                        .setTitle("Выдать доступ пользователю")
                    const Input = new TextInputBuilder()
                        .setCustomId("remove_mod_int")
                        .setPlaceholder(`${interaction.user.id}`)
                        .setLabel("напишите айди пользователя")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(32)
                    Modal.addComponents(new ActionRowBuilder().addComponents(Input))
                    await interaction.showModal(Modal)
                }
                if (interaction.customId == "owner") {
                    const Modal = new ModalBuilder()
                        .setCustomId("owner_mod")
                        .setTitle("Передать права комнаты")
                    const Input = new TextInputBuilder()
                        .setCustomId("owner_mod_int")
                        .setPlaceholder(`${interaction.user.id}`)
                        .setLabel("напишите айди пользователя")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(32)
                    Modal.addComponents(new ActionRowBuilder().addComponents(Input))
                    await interaction.showModal(Modal)
                }
                if (interaction.customId == "name") {
                    const Modal = new ModalBuilder()
                        .setCustomId("name_mod")
                        .setTitle("Изменить название комнаты")
                    const Input = new TextInputBuilder()
                        .setCustomId("name_mod_int")
                        .setPlaceholder(`...`)
                        .setLabel("Название")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(32)
                    Modal.addComponents(new ActionRowBuilder().addComponents(Input))
                    await interaction.showModal(Modal).catch(() => null)
                }
                if (interaction.customId == "limit") {
                    const Modal = new ModalBuilder()
                        .setCustomId("limit_mod")
                        .setTitle("Изменить лимит пользователей")
                    const Input = new TextInputBuilder()
                        .setCustomId("limit_mod_int")
                        .setPlaceholder(`10`)
                        .setLabel("кол-во")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(2)
                    Modal.addComponents(new ActionRowBuilder().addComponents(Input))
                    await interaction.showModal(Modal).catch(() => null)
                }
            } else {
                return interaction.reply({ content: `> На данный момент, Вы не имеете своей комнаты.`, ephemeral: true }).catch(() => null)
            }
        }
        if (interaction.type == InteractionType.ModalSubmit) {
            const data = await client.db.guild.findOne({ guildId: interaction.guild.id })
            const userdata = await client.db.user.findOne({ guildId: interaction.guild.id, userId: interaction.user.id })
            if (userdata?.private_voices?.voiceId != null) {
                if (interaction.customId == "mute_mod") {
                    const input = interaction.fields.getTextInputValue("mute_mod_int");
                    try {
                        const member = await interaction.guild.members.fetch(input);
                        if (member?.voice?.channel?.id !== userdata.private_voices.voiceId) return interaction.reply({ content: `> Пользователя нет в вашей в комнате`, ephemeral: true }).catch(() => null)

                        member.voice.setMute(true).catch(() => null)
                        interaction.reply({ content: `<:mute:1102314862866092052> Пользователь замучен в вашей комнате`, ephemeral: true }).catch(() => null)

                    } catch (Err) {
                        interaction.reply({ content: `> Пользователь не найден`, ephemeral: true }).catch(() => null)
                    }
                }
                if (interaction.customId == "unmute_mod") {
                    const input = interaction.fields.getTextInputValue("unmute_mod_int");
                    try {
                        const member = await interaction.guild.members.fetch(input)
                        if (member?.voice?.channel?.id !== userdata.private_voices.voiceId) return interaction.reply({ content: `> Пользователя нет в вашей в комнате`, ephemeral: true }).catch(() => null)

                        member.voice.setMute(false).catch(() => null)
                        interaction.reply({ content: `<:unmute:1102314861351927968> Пользователь размучен в вашей комнате`, ephemeral: true }).catch(() => null)

                    } catch (err) {
                        interaction.reply({ content: `> Пользователь не найден`, ephemeral: true }).catch(() => null)

                    }
                }
                if (interaction.customId == "kick_mod") {
                    const input = interaction.fields.getTextInputValue("kick_mod_int");
                    try {
                        const member = await interaction.guild.members.fetch(input)
                        if (member?.voice?.channel?.id !== userdata.private_voices.voiceId) return interaction.reply({ content: `> Пользователя нет в вашей в комнате`, ephemeral: true }).catch(() => null)

                        member.voice.disconnect().catch(() => null)
                        interaction.reply({ content: `<:kick:1102314868067008632> Пользователь выгнан с вашей комнате`, ephemeral: true }).catch(() => null)
                    }
                    catch (Err) {
                        interaction.reply({ content: `> Пользователь не найден`, ephemeral: true }).catch(() => null)
                    }
                }
                if (interaction.customId == "add_mod") {
                    const input = interaction.fields.getTextInputValue("add_mod_int");
                    try {
                        const member = await interaction.guild.members.fetch(input, { force: true })

                        await interaction.member.voice.channel.permissionOverwrites.create(member.id, { Connect: true }).catch(() => null)
                        interaction.reply({ content: `<:add:1102314865105829959> Пользователю выдан доступ к вашей комнате`, ephemeral: true }).catch(() => null)
                    }
                    catch (err) {
                        interaction.reply({ content: `> Пользователь не найден`, ephemeral: true }).catch(() => null)
                    }
                }
                if (interaction.customId == "remove_mod") {
                    const input = interaction.fields.getTextInputValue("remove_mod_int");
                    try {
                        const member = await interaction.guild.members.fetch(input, { force: true })

                        await interaction.member.voice.channel.permissionOverwrites.create(member.id, { Connect: false }).catch(() => null)
                        interaction.reply({ content: `<:remove:1102314866666119218> Пользователю запрещён доступ к вашей комнате`, ephemeral: true }).catch(() => null)
                    }
                    catch (Err) {
                        interaction.reply({ content: `> Пользователь не найден`, ephemeral: true }).catch(() => null)
                    }
                }
                if (interaction.customId == "owner_mod") {
                    const input = interaction.fields.getTextInputValue("owner_mod_int");
                    try {
                        const member = await interaction.guild.members.fetch(input, { force: true })
                        if (member?.voice?.channel?.id !== userdata.private_voices.voiceId) return interaction.reply({ content: `> Пользователя нет в вашей в комнате`, ephemeral: true }).catch(() => null)
                        await client.db.user.updateOne({ userId: interaction.member.id, guildId: interaction.guild.id }, {
                            $set: {
                                "private_voices.voiceId": null
                            }
                        })

                        await client.db.user.updateOne({ userId: member.id, guildId: interaction.guild.id }, {
                            $set: {
                                "private_voices.voiceId": interaction.member.voice.channel.id
                            }
                        })
                        await member.voice.channel.permissionOverwrites.create(member.id, { ManageChannels: true, MuteMembers: true, DeafenMembers: true })
                        await interaction.member.voice.channel.permissionOverwrites.delete(interaction.member.id)
                        return interaction.reply({ content: `<:owner:1102314870264840232> Новый владелец комнаты — **${member.user.tag}**.`, ephemeral: true }).catch(() => null)
                    }
                    catch (Err) {
                        interaction.reply({ content: `> Пользователь не найден`, ephemeral: true }).catch(() => null)
                    }

                }
                if (interaction.customId == "name_mod") {
                    const input = interaction.fields.getTextInputValue("name_mod_int");
                    interaction.member.voice.channel.setName(input).catch(() => null)
                    await interaction.reply({ content: `<:name:1102314859191877746> Название комнаты изменено`, ephemeral: true })
                }
                if (interaction.customId == "limit_mod") {
                    const input = interaction.fields.getTextInputValue("limit_mod_int");
                    interaction.member.voice.channel.setUserLimit(input).catch(() => null)
                    await interaction.reply({ content: `<:limit:1102314917316526182> Установлен новый лимит пользователей`, ephemeral: true })
                }
            } else {
                return interaction.reply({ content: `> На данный момент, Вы не имеете своей комнаты.`, ephemeral: true }).catch(() => null)
            }
        }
        if (!interaction.isCommand()) return;
        if (!interaction.guild) return;
        const cmd = client.commands.get(interaction.commandName)
        if (!cmd) return;

        if (!await client.db.guild.findOne({ guildId: interaction.guild.id })) await client.db.guild.create({ guildId: interaction.guild.id })
        if (!await client.db.user.findOne({ guildId: interaction.guild.id, userId: interaction.user.id })) await client.db.user.create({ guildId: interaction.guild.id, userId: interaction.user.id })

        if (cmd.user_perm && cmd.user_perm.length > 0 && !interaction.member.permissions.has(cmd.user_perm)) {
            return text(`> ${client.emoji.error} You don\'t have permissions: \`${cmd.user_perm.join(", ")}\``, true);
        }
        if (cmd.bot_perm && cmd.bot_perm.length > 0 && !interaction.guild.members.me.permissions.has(cmd.bot_perm)) {
            return text(`> ${client.emoji.error} I don\'t have permissions: \`${cmd.bot_perm.join(", ")}\``, true);
        }

        if (!cooldowns.has(interaction.commandName)) {
            cooldowns.set(interaction.commandName, new Collection())
        }
        const now = Date.now();
        const timestamps = cooldowns.get(interaction.commandName);
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + (cmd.cooldown || 1) * 1000;;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply(`Wait **${timeLeft.toFixed(2)}s.** and use this command again.`, true);
            }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), (cmd.cooldown || 1) * 1000);
        console.log(`[LOGS]: `.green.bold + `[${interaction.commandName.toUpperCase()}]`.blue.bold + ` ${interaction.user.tag}`.yellow + ` used the command.`.grey)
        try { cmd.execute(client, interaction) } catch { interaction.reply({ content: `> ${client.emoji.danger} An error has occured`, ephemeral: true }) }
    }
}