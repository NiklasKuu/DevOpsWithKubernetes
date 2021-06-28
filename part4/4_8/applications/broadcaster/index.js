require('dotenv').config();
const { connect, StringCodec  } = require("nats");
const TelegramBot = require('node-telegram-bot-api');


const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token);
    
const natsUrl = process.env.NATS_URL;
//const natsUrl = "127.0.0.1:4222"
console.log(natsUrl);

connect({ servers: natsUrl }).then(async (nc) => {
  const sc = StringCodec();
  const sub = nc.subscribe("messages", { queue: "broadcasterQueue" });

  for await (const m of sub) {
    console.log(sc.decode(m.data));
    bot.sendMessage(process.env.TELEGRAM_CHANNEL_ID, m.data);
  }

}).catch((err) => {
  console.error(err);
});

console.log('Starting Broadcaster');
