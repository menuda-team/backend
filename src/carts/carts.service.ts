import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './carts.schema';
import { Model, Types } from 'mongoose';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Product, ProductDocument } from '../products/product.schema';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { SetCartItemsCountDto } from './dto/set-cart-items-count.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async addToCart(id: string, { productId, count }: AddToCartDto) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid productId');
    }

    const product = await this.productModel.findById(productId);
    const cart = await this.cartModel.findById(id);

    const cartProductIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    let cartItemCountResult;

    if (cartProductIndex >= 0) {
      // If product already exists in cart, update its quantity
      cart.items[cartProductIndex].count += count;
      cartItemCountResult = cart.items[cartProductIndex].count;
    } else {
      // If product doesn't exist in cart, add it as a new item
      cart.items.push({ product: productId, count, price: product.price });
      cartItemCountResult = count;
    }

    cart.totalAmount += count * product.price;

    await cart.save();

    return {
      product,
      count: cartItemCountResult,
      price: product.price,
    };
  }

  async removeFromCart(id: string, { productId, count }: RemoveFromCartDto) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid productId');
    }

    const cart = await this.cartModel.findById(id);

    const cartProductIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    let cartItemCountResult;

    if (cartProductIndex >= 0) {
      if (cart.items[cartProductIndex].count > 1) {
        // If product already exists in cart, update its quantity
        cart.items[cartProductIndex].count -= count;
        cartItemCountResult = cart.items[cartProductIndex].count;
      } else {
        cart.items.splice(cartProductIndex, 1);
      }
    }

    const product = await this.productModel.findById(productId);

    cart.totalAmount -= count * product.price;

    await cart.save();

    if (cartItemCountResult) {
      return {
        product,
        count: cartItemCountResult,
        price: product.price,
      };
    }
  }

  recalculateCartTotalAmount(cart: Cart) {
    return cart.items.reduce(
      (total, item) => total + item.price * item.count,
      0,
    );
  }

  async setCartItemsCount(
    id: string,
    { productId, count }: SetCartItemsCountDto,
  ) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid productId');
    }

    const cart = await this.cartModel.findById(id);

    const cartProductIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    const product = await this.productModel.findById(productId);

    let cartItemCountResult;

    if (cartProductIndex >= 0) {
      // If product already exists in cart, update its quantity
      if (count <= 0) {
        cart.items.splice(cartProductIndex, 1);
      } else {
        cart.items[cartProductIndex].count = count;
        cartItemCountResult = cart.items[cartProductIndex].count;
      }
    } else {
      // If product doesn't exist in cart, add it as a new item
      cart.items.push({ product: productId, count, price: product.price });
      cartItemCountResult = count;
    }

    cart.totalAmount = this.recalculateCartTotalAmount(cart);

    await cart.save();

    if (cartItemCountResult) {
      return {
        product,
        count: cartItemCountResult,
        price: product.price,
      };
    }
  }

  create(createCartDto: CreateCartDto) {
    return 'This action adds a new cart';
  }

  findAll() {
    return `This action returns all carts`;
  }

  findOne(id: string) {
    return this.cartModel.findById(id);
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
