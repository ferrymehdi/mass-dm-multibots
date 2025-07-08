import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export default <Command>{
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  execute: async (interaction) => {
    await interaction.reply("Pong!");
  },
};
