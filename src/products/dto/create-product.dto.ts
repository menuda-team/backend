import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Название продукта' })
  readonly name: string;
  readonly image: File;
  readonly weight: number;
  readonly price: number;
  readonly available: boolean;
  readonly description?: string;
  readonly salePrice?: number;
  readonly categories: string[];
}
