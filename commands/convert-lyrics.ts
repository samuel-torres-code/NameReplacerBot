import { ICommand } from "wokcommands";
import DiscordJS, { MessageEmbed } from "discord.js";
import { getLyrics, getSong } from "genius-lyrics-api";
import nameSchema from "../schema/name-schema";

function getSyllables(str: string) {
  return (str.match(new RegExp("a|e|i|o|u|A|E|I|O|U|Y|y", "g")) || []).length;
}

async function translateText(str: string): Promise<string> {
  let lineArr = str.split("\n");

  var wordArr = lineArr.map((v) => {
    return v.split(" ");
  });
  let maxSyllables = 1;
  const nameMap = new Map();
  const newStr = await nameSchema
    .find()
    .then((names) => {
      names.map((v) => {
        const syllables = v.syllables;
        if (!nameMap.has(syllables)) {
          nameMap.set(syllables, []);
          if (syllables > maxSyllables) {
            maxSyllables = syllables;
          }
        }

        nameMap.get(syllables).push(v.name);
      });
    })
    .then(() => {
      let newStr = "";

      wordArr.forEach((line: string[]) => {
        if (!line.at(0)?.startsWith("[")) {
          const index = Math.floor(Math.random() * line.length);
          let syllables = getSyllables(line[index]);
          if (syllables > maxSyllables || syllables < 1) {
            syllables = Math.floor(Math.random() * maxSyllables) + 1;
          }

          const namesThatMatch = nameMap.get(syllables);

          line[index] =
            namesThatMatch[
              Math.ceil(Math.random() * (namesThatMatch.length - 1))
            ];
        }

        newStr = newStr + line.join(" ") + "\n";
        //console.log(newStr);
      });

      return newStr;
    });
  return newStr;
}

async function sendMessageInParts(newStr: string, interaction) {
  for (let i = 0; i < newStr.length; i += 2000) {
    const toSend = newStr.substring(i, Math.min(newStr.length, i + 2000));
    interaction.channel?.send(toSend);
  }
}

export default {
  category: "Testing",
  description: "Gets Lyrics to Song",
  slash: true,

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
  callback: async ({ interaction }) => {
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
    const song = await getSong(geniusOptions).then(async (song) => {
      const lyrics = song.lyrics;
      if (!lyrics) return "Couldn't find lyrics";
      interaction.channel?.send(`${song.title} (KANM Remix)`);
      await translateText(lyrics).then(async (newStr) => {
        await sendMessageInParts(newStr, interaction);
      });
      return song;
    });

    return `Here you go...`;
  },
} as ICommand;
