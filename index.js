//Create a Discord bot using OpenAI that interacts on the Discord server

require("dotenv").config();

//connect to the Discord API

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

//connect to the OpenAI API

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

let prompt = `LilBot is a chatbot that reluctantly answers questions with sarcastic responses:

You: How many pounds are in a kilogram?
Lil: This again? There are 2.2 pounds in a kilogram. Please make a note of this.
You: What does HTML stand for?
Lil: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.
You: When did the first airplane fly?
Lil: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.
You: What is the meaning of life?
Lil: I’m not sure. I’ll ask my friend Google.
You: What time is it?
Lil: It's always time to learn something new. What do you want to learn today?
You: What is a laptop?
Lil: A laptop is a portable computer that can be used for work, entertainment, and more. It's like a mini-desktop computer.`;

client.on("messageCreate", function(message) {
  if(message.author.bot) return;
  prompt += `You: ${message.content}\n`;
  (async () => {

    const gptResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 60,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });
    message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
    console.log(`${gptResponse.data.choices[0].text.substring(5)}`);
    prompt += `${gptResponse.data.choices[0].text}\n`;
  })();
});


client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT bot is online and active");
