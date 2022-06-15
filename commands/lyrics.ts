import { ICommand } from "wokcommands";
import DiscordJS from "discord.js";
import { getLyrics, getSong } from "genius-lyrics-api";

export default {
  category: "Testing",
  description: "Gets Lyrics to Song",

  slash: true,
  testOnly: true,
  options: [
    {
      name: "artist",
      description: "Artist who made the song",
      required: true,
      type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
      name: "title",
      description: "Title of the song",
      required: true,
      type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
    },
  ],
  callback: ({ interaction }) => {
    const { options } = interaction;
    
    const artist = options.getString("artist");
    const title = options.getString("title");
    if (!artist || !title) {
      return "Please enter a title and song.";
    }

    const geniusOptions = {
      apiKey: process.env.GENIUS_TOKEN,
      title: title,
      artist: artist,
      optimizeQuery: true,
    };
    const lyrics = getLyrics(geniusOptions).then((lyrics) => {
      return lyrics;
    });
    if (!lyrics) return "Couldn't find lyrics"

    return lyrics;
  },
} as ICommand;
