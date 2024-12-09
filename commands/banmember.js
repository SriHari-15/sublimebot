const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans the mentioned user",
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User, // Uses enumerated type
      description: "The user to be banned",
      required: true,
    },
    {
      name: "reason",
      type: ApplicationCommandOptionType.String, // Optional reason
      description: "Reason for banning the user",
      required: false,
    },
  ],

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") ||
      `Banned by ${interaction.user.tag}`;
    const targetMember = interaction.guild.members.cache.get(targetUser.id);

    // Check bot permissions
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    ) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("I do not have permission to ban members!")
        .setColor("Red")
        .setTimestamp();

      return await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }

    // Check if the target member exists
    if (!targetMember) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(`${targetUser.tag} is not in this server!`)
        .setColor("Red")
        .setTimestamp();

      return await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }

    // Check if the target member is bannable
    if (!targetMember.bannable) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(`${targetUser.tag} cannot be banned!`)
        .setColor("Red")
        .setTimestamp();

      return await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }

    // Ban the user
    try {
      await targetMember.ban({ reason });

      const successEmbed = new EmbedBuilder()
        .setTitle("User Banned")
        .setDescription(`${targetUser.tag} has been banned successfully!`)
        .setColor("Green")
        .setTimestamp();

      await interaction.reply({
        embeds: [successEmbed],
      });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Ban Failed")
        .setDescription(
          `An unexpected error occurred while trying to ban ${targetUser.tag}`
        )
        .setColor("Red")
        .setTimestamp();

      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
  },
};
