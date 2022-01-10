const { Client, CommandInteraction } = require("discord.js"); // eslint-disable-line no-unused-vars
const { SlashCommandBuilder } = require("@discordjs/builders");

exports.commands = [
    new SlashCommandBuilder()
        .setName("jail")
        .setDescription("Adds the jailed role to the specified user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The target user.")
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName("unjail")
        .setDescription("Removes the jailed role from the specified user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The target user.")
                .setRequired(true))
];

exports.requireMod = true;

/**
 * @param {Client} client
 * @param {CommandInteraction} intr
 * @param {import("../types").Settings} guildSettings
 */
exports.run = async (client, intr, guildSettings) => {
    if (!guildSettings.jailRole) return intr.reply({ content: "Use `/roleconfig jail` before using this command.", ephemeral: true });
    if (!intr.guild.roles.cache.has(guildSettings.jailRole)) return intr.reply({ content: "The role used for jail no longer exists.", ephemeral: true });
    if (!intr.guild.me.permissions.has("MANAGE_ROLES")) return intr.reply({ content: "I don't have permission to manage roles.", ephemeral: true });

    try {
        const member = intr.options.getMember("user");
        if (member.roles.cache.has(guildSettings.jailRole)) {
            await member.roles.remove(guildSettings.jailRole, `Unjailed by ${intr.user.tag}`);
            intr.reply("Unjailed.");
            const index = guildSettings.jailedUsers.indexOf(member.id);
            if (index > -1) guildSettings.jailedUsers.splice(index, 1);
        } else {
            await member.roles.add(guildSettings.jailRole, `Jailed by ${intr.user.tag}`);
            intr.reply("Jailed.");
            guildSettings.jailedUsers.push(member.id);
        }
    } catch (err) {
        intr.reply({ content: "Failed to add/remove the jail role!", ephemeral: true });
    }

    client.guildSettings.set(intr.guild.id, guildSettings);
};