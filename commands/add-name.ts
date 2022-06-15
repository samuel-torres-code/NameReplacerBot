import { ICommand } from "wokcommands";
import DiscordJS from "discord.js";
import nameSchema from "../schema/name-schema";

function getSyllables(str: string) {
  return (str.match(new RegExp("a|e|i|o|u|A|E|I|O|U|Y|y", "g")) || []).length;
}

export default {
  category: "Testing",
  description: "Adds a name to database",

  slash: true,
  options: [
    {
      name: "add-name",
      description: "Name to add",
      required: true,
      type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
    },
  ],
  callback: async ({ interaction }) => {
    const { options } = interaction;

    const name = options.getString("add-name");

    if (!name) {
      return "Please enter a name.";
    }

    const result = await nameSchema.findOne({ name: name });
    if (result) {
      return "This name is already in the list.";
    } else {
      new nameSchema({
        name: name,
        syllables: getSyllables(name),
      }).save();
    }

    return `${name} has been added to the database!`;
  },
} as ICommand;
