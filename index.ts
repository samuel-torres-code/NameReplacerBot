import DiscordJS, { Intents, Interaction } from "discord.js";
import WOKCommands from "wokcommands";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", async () => {
  console.log("NameReplacerBot Online!");

  //Can be used instead of WOK Commands
  // await mongoose.connect(process.env.MONGO_URI || "", {
  //   keepAlive: true,
  // });

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, "commands"),
    typeScript: true,
    testServers: "182247205162188801",
    mongoUri: process.env.MONGO_URI,
    dbOptions: {
      keepAlive: true,
    },
  });

});
client.login(process.env.TOKEN);
