import CartModel from ".";
import CartSchema from "./schema";
import { IProduct } from "../../products/types";
import CouponModel from "../../coupons/model";

CartSchema.pre("save", async function (next) {
  console.log("After document saved", this);

  // get cart (null if new, document if existing already)
  const cart = await CartModel.findById(this._id);
  //   console.log("cart products", cart.products);

  // if cart is new, so total is calculated already
  if (!cart) return next();

  console.log("Cart is existing already!");

  console.log("Real Price of Products", this.populate);
  // increase quantity or add new product in existing cart
  const realProducts = await this.populate({
    path: "products",
    populate: {
      path: "product",
      // select: "category", with "select" doesn't work, i dunno know why
    },
  });

  const totalPrice = realProducts.products.reduce(
    (acc, item) => acc + (item.product as IProduct).price * item.quantity,
    0
  );

  // console.log("this.products", realProducts.products);
  console.log("New Price now is", totalPrice);

  //   Calc total price
  this.totalPurePrice = totalPrice;

  //   Apply discount if any
  if (this.appliedDiscount) {
    const discount = await CouponModel.findById(this.appliedDiscount);
    const priceAfterDiscount = await discount.use(cart.user, totalPrice);
    this.priceAfterDiscount = priceAfterDiscount;
  }

  next();
});

/**
 * @desc Get total Price for all items in the cart
 * await CartModel.aggregate([
    { $match: { _id: cart._id } },
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "products",
        foreignField: "_id",
        localField: "products.product",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: "$products._id",
        totalPrice: {
          $multiply: ["$products.quantity", "$product.price"],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        totalPrice: { $sum: "$totalPrice" },
      },
    },
  ]);
 */

/**
 * @desc Get all data of all these ObjectIds
 * @desc you send list of product ids and get all the products
 * const cartItems = await ProductModel.where("_id").in(
    this.products.map((item) => item.product)
  );
 */
