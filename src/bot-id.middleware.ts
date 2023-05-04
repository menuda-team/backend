import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

@Injectable()
export class BotIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const botId = Array.isArray(req.headers['bot-id'])
      ? req.headers['bot-id'][0]
      : req.headers['bot-id'];

    if (!Types.ObjectId.isValid(botId)) {
      throw new Error('Invalid bot id');
    }

    req.query.botId = botId;

    next();
  }
}
