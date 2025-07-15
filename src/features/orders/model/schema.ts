import { Schema } from "mongoose";
import { IOrder, IOrderMethods, IOrderModel, OrderStatus } from "../types";

const OrderSchema = new Schema<IOrder, IOrderModel, IOrderMethods>(
  {
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },

    status: {
      type: String,
      enum: [
        OrderStatus.PENDING,
        OrderStatus.CASH_ON_DELIVERY,
        OrderStatus.DISPATCHED,
        OrderStatus.PROCESSING,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
      ],
      default: OrderStatus.PENDING,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default OrderSchema;
