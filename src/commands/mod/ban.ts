import { Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, GuildMember, EmbedBuilder, time } from "discord.js";
import { ConfirmButton } from "../../modules/ConfirmButton";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("ban member from discord")
        .setDMPermission(false)
        .addUserOption((option) =>
            option.setName("user").setDescription("Target to ban").setRequired(true)
        )
        .addStringOption((option) =>
            option.setRequired(true).setName("reason").setDescription("reason to ban")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const Target = interaction.options.getMember("user")
        const member = Target as unknown as GuildMember
        const reason = interaction.options.getString("reason")
        if (!member.bannable)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`I don't have permissions to ban ${member}.`),
                ],
            });
        if (member.id === interaction.user.id)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`You cannot ban yourself.`),
                ],
            });


        const confirmation = await ConfirmButton(
            interaction,
            new EmbedBuilder()
                .setTitle("Pending Conformation")
                .setColor("Blurple")
                .setDescription(
                    `Are you sure you want to ban ${member} for reason: \`${reason}\`?`
                )
                .setFooter({ text: "You have 60 seconds." })
        );

        if (confirmation.proceed) {
            if (!confirmation.i) return;
            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`**${member.user.tag}** was banned for \`${reason}\`.`);

            try {
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("You were banned")
                            .setColor("Blurple")
                            .addFields(
                                { name: `Reason`, value: `${reason}` },
                                { name: `ServerName : `, value: `${interaction.guild?.name}` },
                                { name: `time :`, value: time(new Date(), "F") }
                            ),
                    ],
                });
            } catch (err) {
                embed.setFooter({
                    text: `I was not able to DM inform them`,
                });
            }
            await confirmation?.i.update({
                embeds: [embed],
                components: [],
            });
            return await member.ban({ reason: `${reason}` });
        }

        const embed = new EmbedBuilder()
            .setTitle("Process Cancelled")
            .setColor("Blurple")
            .setDescription(`${member} was not banned.`);

        if (confirmation?.reason) embed.setFooter({ text: confirmation?.reason });
        if (!confirmation.i) return;
        await confirmation.i.update({
            embeds: [embed],
            components: [],
        });


    },
};