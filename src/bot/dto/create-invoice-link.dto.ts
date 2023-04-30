import { LabeledPrice } from 'telegraf/typings/core/types/typegram';

export class CreateInvoiceLinkDto {
  readonly prices: LabeledPrice[];
}
