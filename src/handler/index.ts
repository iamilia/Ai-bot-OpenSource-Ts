import { readdirSync } from "fs";
import "dotenv/config";

const regexTsOrJs = /\.ts$|\.js$/;
export default async (client: any) => {
  const commandsArray: Array<[]> = [];
  const commandFolders = readdirSync("./src/commands");
  for (const category of commandFolders) {
    const commandFiles = readdirSync(`./src/commands/${category}`).filter(
      (file) => regexTsOrJs.test(file)
    );
    for (const file of commandFiles) {
      const command = await import(`../commands/${category}/${file}`);
      await client.commands.set(command.default.data.name, command.default);
      commandsArray.push(command.default.data);
    }
  }
  console.log(`${commandsArray.length} command loaded successfully.`);

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
      .commands.set(commandsArray);
    await client.application.commands.set(commandsArray);
  });
};
