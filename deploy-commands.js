const { REST, Routes, Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID; // Your bot's client ID

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push({
    name: command.name,
    description: command.description,
  });
}

// Create a temporary client to fetch guild IDs
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    // Fetch all guilds the bot is part of
    const guilds = await client.guilds.fetch();

    console.log("Found guilds:");
    for (const [guildId, guild] of guilds) {
      console.log(` - ${guild.name} (${guildId})`);

      // Register commands for each guild
      const rest = new REST({ version: "10" }).setToken(token);

      console.log(`Registering commands for guild: ${guild.name} (${guildId})`);
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      console.log(`Successfully registered commands for guild: ${guild.name}`);
    }
  } catch (error) {
    console.error("Error fetching guilds or registering commands:", error);
  } finally {
    client.destroy(); // Cleanly shut down the temporary client
  }
});

client.login(token);
