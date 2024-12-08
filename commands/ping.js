module.exports = {
  name: 'ping',
  description: 'Returns bot latency and API latency',

  async execute(interaction) {
    // Get the time before sending the reply
    const start = Date.now();

    // Reply and calculate latency
    const botLatency = start - interaction.createdTimestamp; // Bot's latency in ms
    const apiLatency = interaction.client.ws.ping; // API latency in ms

    // Reply with the latency information
    await interaction.reply({
      content: `Bot Latency: ${botLatency}ms\nAPI Latency: ${apiLatency}ms`,
      ephemeral: false, // Optional, makes the message visible only to the user who invoked the command
    });
  },
};
