import { Telegraf } from 'telegraf';

const BOT_TOKEN = '5820129314:AAFxXiHY3Y28OUF32xKudHg2anxb7LfdJt4';
const YO_KASSA_TEST_TOKEN = '381764678:TEST:53320';

const bot = new Telegraf(BOT_TOKEN);

const START_MESSAGE = `
Привет!

Это бот для заказа еды из ресторана Любимое кафе.

Чтобы открыть меню, нажми на кнопку ☰ в левом нижнем углу. 

Приятного аппетита 😋
`;

bot.telegram.setChatMenuButton({
  menuButton: {
    type: 'web_app',
    text: 'Menu',
    web_app: {
      url: 'https://menuda.ru/menu',
    },
  },
});

bot.start((ctx) => ctx.reply(START_MESSAGE));
bot.help((ctx) => ctx.reply(START_MESSAGE));

export default bot;
