import { config } from "dotenv";
config();
import handler from "./handler";
import { Client, Collection } from "discord.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, any>;
        buttons: Collection<string, any>;
        modals: Collection<string, any>;
    }
}

const client = new Client({ intents: 32767 });

export default client;

client.commands = new Collection();
client.buttons = new Collection();

(async () => {
    console.clear()
    await handler(client);
    await client.login(process.env.TOKEN);
})();

// ———————————————[Error Handling]———————————————
process.on("unhandledRejection", (reason, p) => {
    console.log("—————————————————————————————————");
    console.log(
        "[",
        "AntiCrash",
        "]",
        " : ",
        "Uncaught Exception/Catch"
    );
    console.log(reason, p);
    console.log("—————————————————————————————————");
});
process.on("uncaughtException", (err, origin) => {
    console.log("—————————————————————————————————");
    console.log(
        "[",
        "AntiCrash",
        "]",
        " : ",
        "Uncaught Exception/Catch"
    );
    console.log(err, origin);
    console.log("—————————————————————————————————");
});