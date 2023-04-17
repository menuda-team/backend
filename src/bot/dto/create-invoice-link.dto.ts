import { LabeledPrice } from 'typegram';

export class CreateInvoiceLinkDto {
  readonly prices: LabeledPrice[];
}
