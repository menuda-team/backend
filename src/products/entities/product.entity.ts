import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({ example: 'Бургер', description: 'Название блюда' })
  readonly name: string;

  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly imageUrl: string;

  @ApiProperty()
  readonly weight: number;

  @ApiProperty()
  readonly price: number;

  @ApiProperty()
  readonly available: boolean;

  @ApiProperty()
  readonly description?: string;

  @ApiProperty()
  readonly salePrice?: number;

  @ApiProperty()
  readonly category?: string;
}
