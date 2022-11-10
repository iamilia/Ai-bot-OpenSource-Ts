import { readdirSync } from "fs";
import "dotenv/config";

const regexTsOrJs = /\.ts$|\.js$/;
export default async (client: any) => {
  const SlashcommandsArray: Array<[]> = [];
  const SlashcommandFolders = readdirSync("./src/Slashcommands");
  for (const category of SlashcommandFolders) {
    const commandFiles = readdirSync(`./src/Slashcommands/${category}`).filter(
      (file) => regexTsOrJs.test(file)
    );
    for (const file of commandFiles) {
      const command = await import(`../Slashcommands/${category}/${file}`);
      await client.commands.set(command.default.data.name, command.default);
      SlashcommandsArray.push(command.default.data);
    }
  }
  console.log(`Slashcommands : ${SlashcommandsArray.length} loaded successfully.`);

  const ChatcommandsArray: Array<[]> = [];
  const ChatcommandFolders = readdirSync("./src/Chatcommands");
  for (const category of ChatcommandFolders) {
    const commandFiles = readdirSync(`./src/Chatcommands/${category}`).filter(
      (file) => regexTsOrJs.test(file)
    );
    for (const file of commandFiles) {
      const command = await import(`../Chatcommands/${category}/${file}`);
      await client.Chatcommands.set(command.default.name, command.default);
      ChatcommandsArray.push(command.default.data);
    }
  }
  console.log(`Chatcommand : ${ChatcommandsArray.length} loaded successfully.`);

  const buttonsFiles = readdirSync("./src/buttons").filter((file) =>
    regexTsOrJs.test(file)
  );
  for (const file of buttonsFiles) {
    const button = await import(`../buttons/${file}`);
    await client.buttons.set(button.default.data.data.custom_id, button);
    console.log(
      `${button.default.data.data.custom_id} button loaded successfully.`
    );
  }

  const eventFiles = readdirSync("./src/events").filter((file) =>
    regexTsOrJs.test(file)
  );
  for (const file of eventFiles) {
    const event = await import(`../events/${file}`);
    if (event.once) {
      client.once(event.default.name, (...args: any) =>
        event.default.run(...args, client)
      );
    } else {
      client.on(
        event.default.name,
        async (...args: any) => await event.default.run(...args, client)
      );
    }
  }

  client.on("ready", async () => {
    await client.guilds.cache
      .get(process.env.GUILD)
      .commands.set(SlashcommandsArray);
    await client.application.commands.set(SlashcommandsArray);
  });
};
