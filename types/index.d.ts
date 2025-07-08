import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

interface Command {
  /**
   * The data for the command, including its name, description, and options.
   */
  data: SlashCommandBuilder;

  /**
   * Indicates whether the command is only for owners of the bot.
   * If true, the command will only be executable by the bot owner(s).
   */
  ownersOnly?: boolean;

  /**
   * Executes the command when the interaction is received.
   * @param interaction The interaction that triggered the command.
   */
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
