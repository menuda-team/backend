export class CreateProductDto {
  readonly name: string;
  readonly image: File;
  readonly weight: number;
  readonly price: number;
  readonly available: boolean;
  readonly description?: string;
  readonly salePrice?: number;
  readonly category?: string;
}
