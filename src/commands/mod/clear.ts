import { Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel, MessageResolvable } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("clear chat in current channel")
        .addNumberOption(option =>
            option
                .setName("amount")
                .setDescription(" amount to clear")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const amount = interaction.options.getNumber("amount", true);
        const channel = await interaction.channel as TextChannel;
        channel.bulkDelete(amount, true).then((messages) => {
            interaction.reply(`${messages.size} messages have been successfully deleted!`);
        });
    },
};