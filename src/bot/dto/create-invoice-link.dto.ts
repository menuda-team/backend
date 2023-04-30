import { CartItemRich } from '../../users/user.schema';

export class CreateInvoiceLinkDto {
  readonly items: CartItemRich[];
}
