import { Telegraf } from 'telegraf';
import { BotsService } from './bots.service';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';
import { CartsService } from '../carts/carts.service';

const START_MESSAGE = `
Привет!

Это бот для заказа еды из ресторана.

Чтобы открыть меню, нажми на кнопку ☰ в левом нижнем углу.

Приятного аппетита 😋
`;

type CreateBotParams = {
  token: string;
  botsService: BotsService;
  usersService: UsersService;
  ordersService: OrdersService;
  cartsService: CartsService;
  botId: string;
};

export const createBot = async ({
  token,
  botsService,
  usersService,
  ordersService,
  cartsService,
  botId,
}: CreateBotParams) => {
  const bot = new Telegraf(token);

  bot.start((ctx) => ctx.reply(START_MESSAGE));

  bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));

  bot.on('successful_payment', async (ctx) => {
    const botLogin = ctx.botInfo.username;
    const bot = await botsService.findByLogin(botLogin);

    const { id: userId } = ctx.message.from;
    const { total_amount } = ctx.message.successful_payment;
    const { items, _id } = await usersService.getCart(userId, botId);

    await cartsService.remove(_id.toString());

    await ordersService.create({
      items,
      totalAmount: total_amount,
      user: userId,
      bot: bot._id,
    });
  });

  return bot;
};
