import { ICommand } from "wokcommands";
import DiscordJS from "discord.js";
import nameSchema from "../schema/name-schema";

function getSyllables(str: string) {
  return (str.match(new RegExp("a|e|i|o|u|A|E|I|O|U|Y|y", "g")) || []).length;
}

export default {
  category: "Testing",
  description: "Deletes a name from database",

  slash: true,
  options: [
    {
      name: "name",
      description: "Name to delete",
      required: true,
      type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
    },
  ],
  callback: async ({ interaction }) => {
    const { options } = interaction;

    const name = options.getString("name");

    if (!name) {
      return "Please enter a name.";
    }

    const result = await nameSchema.findOne({ name: name });
    if (!result) {
      return "This name is not in the list.";
    } else {
      await nameSchema.deleteOne({ name: name });
    }

    return `${name} has been deleted from the database!`;
  },
} as ICommand;
