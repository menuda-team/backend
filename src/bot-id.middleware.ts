import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BotIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const botId = req.headers['bot-id'];
    req.query.botId = Array.isArray(botId) ? botId[0] : botId;

    next();
  }
}
