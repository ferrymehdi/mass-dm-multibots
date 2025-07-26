import { Colors, EmbedBuilder, Guild, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import { clients } from "..";
import { getJsonFromURL } from "../utils/discohook";

export default <Command>{
  data: new SlashCommandBuilder()
    .setName("mass-dm")
    .setDescription("Sends a direct message to all users in the server.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send to all users")
        .setRequired(true),
    ),
  ownersOnly: true,
  execute: async (interaction) => {
    const message = interaction.options.getString("message", true);
    const guild = interaction.guild as Guild;

    const clientsInGuild = clients.filter((client) =>
      client.guilds.cache.has(guild.id),
    );
    if (clientsInGuild.length === 0) {
      return interaction.reply({
        content: "No clients are in this guild.",
        ephemeral: true,
      });
    }

    const DISCOHOOK_URL_REGEX =
      /^(https?:\/\/)?(www\.)?(discohook\.app|discohook\.org)\/\?data=/;
    let content = message.trim();

    const embeds: any[] = [];
    if (DISCOHOOK_URL_REGEX.test(message)) {
      const discohook = getJsonFromURL(message);
      if (discohook) {
        if (discohook.embeds && discohook.embeds.length > 0) {
          for (const embed of discohook.embeds) {
            embeds.push(embed);
          }
        }
        if (discohook.content) {
          content = discohook.content;
        }
      }
    }

    const variables: Map<string, string> = new Map();

    variables.set("guild.name", guild.name);
    variables.set("guild.id", guild.id);

    const totalClients = clientsInGuild.length;
    const allMembers = guild.members.cache.filter((m) => !m.user.bot);
    const done: { clientId: string; done: number; failed: number }[] =
      clientsInGuild.map((client) => ({
        clientId: client.user?.id as string,
        done: 0,
        failed: 0,
      }));

    const getTotallDone = () => {
      return done.reduce((acc, cur) => acc + cur.done, 0);
    };
    const getTotallFailed = () => {
      return done.reduce((acc, cur) => acc + cur.failed, 0);
    };
    const getTotall = () => {
      return getTotallDone() + getTotallFailed();
    };
    const isDone = () => {
      return getTotall() === allMembers.size;
    };
    const getEmbed = () => {
      const color = isDone() ? Colors.Green : Colors.Yellow;
      return new EmbedBuilder()
        .setTitle("Mass DM Status")
        .setDescription(
          `Total: ${allMembers.size}\nDone: ${getTotallDone()}\nFailed: ${getTotallFailed()}\nStatus: ${isDone() ? "Done" : "In Progress"}`,
        )
        .setColor(color)
        .setTimestamp();
    };

    const statusMessage = await interaction.reply({
      embeds: [getEmbed()],
    });
    let clientIndex = 0;
    for (const member of allMembers.values()) {
      if (!clientsInGuild[clientIndex]) {
        clientIndex = 0;
      }
      variables.set("user.username", member.user.username);
      variables.set("user.id", member.user.id);
      variables.set("user.tag", member.user.tag);
      variables.set("user.avatar", member.user.displayAvatarURL());
      variables.set("user.mention", member.user.toString());

      const client = clientsInGuild[clientIndex] as any;
      const clientDone = done.find(
        (d) => d.clientId === client.user?.id,
      ) as any;
      clientIndex = (clientIndex + 1) % totalClients;
      try {
        // await client.users.send(member.user.id, message);
        for (const [key, value] of variables.entries()) {
          // Replace {key} with value in content
          content = content.replace(new RegExp(`{${key}}`, "g"), value);
        }

        await client.users.send(member.user.id, {
          content: content,
          embeds: embeds,
        });
        clientDone.done++;
      } catch (error) {
        console.error(`Failed to send message to ${member.user.tag}:`, error);
        clientDone.failed++;
      }
      try {
        await statusMessage.edit({
          embeds: [getEmbed()],
        });
      } catch (error) {
        console.error("Failed to edit status message:", error);
      }
    }
  },
};
