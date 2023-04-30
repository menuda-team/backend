import { OrderItem } from '../order.schema';

export class CreateOrderDto {
  readonly items: OrderItem[];
  readonly totalAmount: number;
  readonly user: number;
}
