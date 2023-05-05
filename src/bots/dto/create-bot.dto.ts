import { CreateProductDto } from '../../products/dto/create-product.dto';

export class CreateBotDto {
  readonly login: string;
  readonly token: string;
  readonly products?: CreateProductDto[];
  readonly admins: string[];
}
