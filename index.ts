import config from "./config.json";
import { Client, GatewayIntentBits } from "discord.js";
import type { Command } from "./types";

const commands: Command[] = [
  require("./Commands/ping"),
  require("./Commands/mass-dm"),
].map((c) => c.default);

const clients: Client[] = [];

config.tokens.forEach((token: string, index: number) => {
  const client = new Client({
    intents: Object.values(GatewayIntentBits) as [],
  });

  client.once("ready", () => {
    console.log(`Client ${index + 1} - ${client.user?.username} is ready!`);

    client.application?.commands.set(
      commands.map((command) => command.data.toJSON()),
    );

    clients.push(client);
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find(
      (cmd) => cmd.data.name === interaction.commandName,
    );
    if (!command) return;
    if (command.ownersOnly && !config.owners.includes(interaction.user.id)) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  });

  client.login(token);
});

export { clients, commands };

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  clients.forEach((client) => client.destroy());
  process.exit(0);
});

