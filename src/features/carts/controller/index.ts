import { NextFunction, Request, Response } from "express";
import { apiResponse, catchAsync } from "../../../common/helpers";
import ProductRepository from "../../products/repository";
import CartRepository from "../repository";
import ErrorAPI from "../../../common/ErrorAPI";
import CouponRepository from "../../coupons/repository";
import { Types } from "mongoose";

class CartController {
  private productRepository: ProductRepository;
  private cartRepository: CartRepository;
  private couponRepository: CouponRepository;
  constructor() {
    this.productRepository = new ProductRepository();
    this.cartRepository = new CartRepository();
    this.couponRepository = new CouponRepository();
  }

  addItemToCart = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { productId, quantity, color } = req.body;
      const { user } = req;

      const product = await this.productRepository.readOne({ _id: productId });
      // console.log("ID", productId, "product", product);

      if (!product) {
        return next(ErrorAPI.notFound("Product is not in shop!"));
      }

      // TODO: Validation Layer - first check if there is an cart is already created for the user
      let cart = await this.cartRepository.readOne({ user: user.id });
      if (!cart) {
        // if not, create a new cart with the product he wants to add
        cart = await this.cartRepository.create({
          user: user.id,
          products: [{ product: productId, quantity, color }],
          totalPurePrice: product.price * quantity,
        });

        return apiResponse(res, 200, "Product added to cart", { cart });
      }

      // if the cart already exists, then check if the product is already in the cart
      const productIndex = cart.products.findIndex(
        (pd) => pd.product.toString() === productId
      );
      console.log("Product Index", productIndex);

      // check if the product is already in the cart, OR if in the cart but with a different color
      if (
        productIndex === -1 ||
        (productIndex !== -1 && cart.products[productIndex].color !== color)
      ) {
        cart.products.push({
          product: productId,
          quantity,
          color,
        });
      } else {
        cart.products[productIndex].quantity += quantity;
      }

      await cart.save();

      // TODO: calculate the total price of the cart

      // TODO: calculate the total price of the cart after discount

      return apiResponse(res, 200, "Cart updated Successfully", { cart });
    }
  );

  removeItemFromCart = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { productId, color } = req.body;
      const { user } = req;

      const cart = await this.cartRepository.readOne({ user: user.id });
      if (!cart) {
        return next(
          ErrorAPI.notFound(
            "Cart not found, you cannot remove a product from a cart that does not exist"
          )
        );
      }

      const productIndex = cart.products.findIndex((product) => {
        return product.product === productId && product.color === color;
      });

      if (productIndex === -1) {
        return next(ErrorAPI.notFound("Product not found in the cart"));
      }

      cart.products.splice(productIndex, 1);

      // TODO: Re-calculate the total price of the cart

      await cart.save();
    }
  );

  getCart = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    const cart = await this.cartRepository.readOne({ user: user.id });

    if (!cart) {
      return apiResponse(res, 200, "Cart is empty", { cart: null });
    }

    return apiResponse(res, 200, "Cart found", { cart });
  });

  clearCart = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    const cart = await this.cartRepository.readOne({ user: user.id });

    if (!cart) {
      return apiResponse(res, 200, "Cart is already empty", { cart: null });
    }

    cart.products = [];
    cart.totalPurePrice = 0;
    cart.priceAfterDiscount = 0;
    cart.appliedDiscount = undefined;

    await cart.save();
  });

  increaseItemInCart = catchAsync(async (req: Request, res: Response) => {
    const { productId, color } = req.body;
    const { user } = req;

    // repeated validations - TODO: move to a middleware
    const cart = await this.cartRepository.readOne({ user: user.id });

    if (!cart) {
      return apiResponse(res, 200, "Cart is empty", { cart: null });
    }

    console.log("Cart Products", cart.products);
    const productIndex = cart.products.findIndex((product) => {
      return (
        product.product.toString() === productId && product.color === color
      );
    });

    // TODO: Load the product from the database to get the price
    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1, color });
    } else {
      cart.products[productIndex].quantity += 1; // decrease the quantity of the product
    }

    // TODO: Re-calculate the total price of the cart

    await cart.save();

    return apiResponse(res, 200, "Cart updated Successfully", { cart });
  });

  decreaseItemFromCart = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { productId, color } = req.body;
      const { user } = req;

      // repeated validations - TODO: move to a middleware
      const cart = await this.cartRepository.readOne({ user: user.id });

      if (!cart) {
        return apiResponse(res, 200, "Cart is already empty", { cart: null });
      }

      const productIndex = cart.products.findIndex((product) => {
        return (
          product.product.toString() === productId && product.color === color
        );
      });

      if (productIndex === -1) {
        return next(ErrorAPI.notFound("Product not found in the cart"));
      }

      if (cart.products[productIndex].quantity === 1) {
        cart.products.splice(productIndex, 1); // remove the product from the cart
      } else {
        cart.products[productIndex].quantity -= 1; // decrease the quantity of the product
      }

      // TODO: Re-calculate the total price of the cart

      await cart.save();

      return apiResponse(res, 200, "Cart updated Successfully", { cart });
    }
  );

  applyDiscountToCart = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { discountCode } = req.body;
      const coupon = await this.couponRepository.readOne({
        code: discountCode,
      });
      if (!coupon) return next(ErrorAPI.notFound("Coupon in not available!"));

      const myCart = await this.cartRepository.readOne({ user: req.user.id });
      if (
        myCart.appliedDiscount &&
        myCart.appliedDiscount.toString() === coupon._id.toString()
      ) {
        return next(ErrorAPI.badRequest("Coupon is used already!"));
      }

      myCart.appliedDiscount = new Types.ObjectId(coupon._id);
      console.log("_id", coupon._id, "appliedDiscount", myCart.appliedDiscount);
      await myCart.save();

      return apiResponse(res, 200, "Coupon is applied to your cart", {
        cart: myCart,
      });
    }
  );

  checkout = catchAsync(async (req: Request, res: Response) => {
    console.log("Res", res);
    console.log("Req", req);

    return apiResponse(res, 200, "Checkout");
  });
}

export default new CartController();

/**
 * Some Notes
 * @IDEA We can replace identifier (productId, color) with create another table/model called CartItem that will have a reference to the product and the color
 */
