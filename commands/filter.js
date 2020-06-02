const { Client, Message } = require("discord.js"); // eslint-disable-line no-unused-vars

exports.help = {
    name: "filter",
    usage: "filter <add|remove|list> [args]",
    info: "Sets the word filter",
    requireAdmin: true
};

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {string[]} args
 */
exports.run = async (client, msg, args, guildSettings) => {
    if (args.length === 0) return msg.channel.send(`${guildSettings.prefix}${exports.help.usage}`, { code: "" });
    if (!msg.guild.me.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("I need the \"Manage Messages\" permission in order to filter messages!");

    switch (args[0]) {
        case "add":
            if (args.length !== 2) return msg.channel.send(`${guildSettings.prefix}filter add <word>`, { code: "" });

            guildSettings.badWords.push(args[1].toLowerCase());
            client.guildSettings.set(msg.guild.id, guildSettings);
            client.regenRegex(msg.guild.id);

            msg.channel.send(`Successfully added \`${args[1]}\` to the word filter`);
            break;
        case "remove":
            if (args.length !== 2) return msg.channel.send(`${guildSettings.prefix}filter remove <word>`, { code: "" });

            if (!guildSettings.badWords.includes(args[1].toLowerCase())) return msg.channel.send("Word not found in filter");

            guildSettings.badWords = guildSettings.badWords.filter(word => word !== args[1].toLowerCase());
            client.guildSettings.set(msg.guild.id, guildSettings);
            client.regenRegex(msg.guild.id);

            msg.channel.send(`Successfully removed \`${args[1]}\` from the word filter`);
            break;
        case "list": {
            let final = "";

            guildSettings.badWords.forEach(word => final += `${word}\n`);

            msg.channel.send(`Word filter:\n\`\`\`${final.length === 0 ? "None" : final}\`\`\``);
            break;
        }
    }
};