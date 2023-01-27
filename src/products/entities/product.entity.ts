export class Product {
    readonly name: string;
    readonly id: number;
    readonly imageUrl: string;
    readonly weight: number;
    readonly price: number;
    readonly available: boolean;
    readonly description?: string;
    readonly salePrice?: number;
    readonly category?: string;
}
