import { Telegraf } from 'telegraf';

// console.log('!!!process.env.BOT_TOKEN:', process.env.BOT_TOKEN);
// console.log('!!!process.env:', process.env);

// const bot = new Telegraf(process.env.BOT_TOKEN);

const START_MESSAGE = `
Привет!

Это бот для заказа еды из ресторана Любимое кафе.

Чтобы открыть меню, нажми на кнопку ☰ в левом нижнем углу. 

Приятного аппетита 😋
`;

// bot.telegram.setChatMenuButton({
//   menuButton: {
//     type: 'web_app',
//     text: 'Menu',
//     web_app: {
//       url: `${process.env.CLIENT_URL}/menu`,
//     },
//   },
// });

// bot.start((ctx) => ctx.reply(START_MESSAGE));
// bot.help((ctx) => ctx.reply(START_MESSAGE));

// bot.telegram.setWebhook(process.env.BACKEND_URL, {});

// export default bot;
