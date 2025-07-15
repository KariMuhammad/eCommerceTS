import { Types } from "mongoose";
import { OrderStatus } from "../types";
import { apiResponse, catchAsync } from "../../../common/helpers";
import ErrorAPI from "../../../common/ErrorAPI";
import { RefundStatus } from "../../../common/constants";

import CartRepository from "../../carts/repository";
import RefundRepository from "../../refund/repository";
import OrderRepository from "../repository";

class OrderController {
  private cartRepository: CartRepository;
  private orderRepository: OrderRepository;
  private refundRepository: RefundRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.orderRepository = new OrderRepository();
    this.refundRepository = new RefundRepository();
  }

  /**
   * @description returns all orders of client user who ordered - not admin
   */
  read = catchAsync(async (req, res, next) => {
    const user = req.user;
    const ordersOfUser = await this.orderRepository.read({
      orderedBy: user.id || user._id,
    });

    if (!ordersOfUser) {
      return next(
        ErrorAPI.notFound("Unfortuantelly, you haven't any orders right now!")
      );
    }

    return apiResponse(res, 200, "All orders are fetched successfully.", {
      orders: ordersOfUser,
    });
  });

  readOne = catchAsync(async (req, res) => {
    const user = req.user;
    const { id: orderId } = req.params;

    const orderOfUserWithThisId = await this.orderRepository.readOne({
      orderedBy: user.id,
      _id: orderId,
    });

    if (!orderOfUserWithThisId) {
      return apiResponse(res, 407, "The Order is not found!", null); // 500 for test my customization solution
    }

    return apiResponse(res, 200, "The order fetched successfully", {
      order: orderOfUserWithThisId,
    });
  });

  create = catchAsync(async (req, res, next) => {
    // Optional
    const { address: addressOfUser, paymentMethod } = req.body;

    const user = req.user;

    console.log(user?.id);

    const cartOfUser = await this.cartRepository.readOne({ user: user.id });

    if (!cartOfUser) {
      return next(ErrorAPI.notFound("You haven't any cart right now!"));
    }

    // Send notification for market which has the products user ordered.
    // It is good to cart register market name in every products, to make easy for admin, or vendor search on carts which belongs

    const order = await this.orderRepository.create({
      orderedBy: user.id,
      cart: new Types.ObjectId(cartOfUser._id),
      paymentMethod: paymentMethod,
      address: addressOfUser || user.addresses[0],
      totalPrice: cartOfUser.finalPrice(),
    });

    if (!order) {
      return next(ErrorAPI.internal("The order is not created!"));
    }

    return apiResponse(res, 201, "The order is created successfully.", {
      order,
    });
  });

  /**
   * @description Update status of the order
   * @access Private/Admin
   */
  update = catchAsync(async (req, res, next) => {
    const { id: orderId } = req.params;
    const { status } = req.body;

    const order = await this.orderRepository.change({
      selector: { _id: orderId },
      data: { status },
    });
    if (!order) return next(ErrorAPI.notFound("The order is not found!"));

    return apiResponse(res, 200, "The order is updated successfully.", {
      order,
    });
  });

  /**
   * @description Refund the order
   * @access Private/User
   */
  refund = catchAsync(async (req, res, next) => {
    const { id: orderId } = req.params;
    const order = await this.orderRepository.readOne({ _id: orderId });
    if (!order) return next(ErrorAPI.notFound("The order is not found!"));

    const refund = await this.refundRepository.create({
      orderId: order.id,
      amount: order.totalPrice,
      status: RefundStatus.PENDING,
    });

    return apiResponse(res, 200, "The order is refunded successfully.", {
      refund,
    });
  });

  /**
   * @description Delete the order
   * @access Private/Admin
   */
  delete = catchAsync(async (req, res, next) => {
    const { id: orderId } = req.params;

    const order = await this.orderRepository.change({
      selector: { _id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
    if (!order) return next(ErrorAPI.notFound("The order is not found!"));

    return apiResponse(res, 200, "The order is deleted successfully.", {
      order,
    });
  });

  /**
   * @description Cancel the order
   * @access Private/User
   */
  cancel = catchAsync(async (req, res, next) => {
    const { id: orderId } = req.params;

    // Should ask for cancel, to directly cancel the order (admin should do that)
    const order = await this.orderRepository.change({
      selector: { _id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
    if (!order) return next(ErrorAPI.notFound("The order is not found!"));

    return apiResponse(res, 200, "The order is cancelled successfully.", {
      order,
    });
  });

  /**
   * @description Get the all orders for admin
   * @access Private/Admin
   */
  readAll = catchAsync(async (req, res) => {
    console.log("Admin is fetching all orders...");
    const orders = await this.orderRepository
      .read({})
      .populate("orderedBy", "first_name last_name email");

    if (!orders || orders.length === 0) {
      return apiResponse(res, 404, "There is no order right now!", null);
    }

    return apiResponse(res, 200, "All orders are fetched successfully.", {
      orders,
    });
  });
}

export default OrderController;
