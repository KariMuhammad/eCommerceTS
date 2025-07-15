import { Schema } from "mongoose";
import { IRefund, IRefundMethods, IRefundModel } from "../types";

const RefundSchema = new Schema<IRefund, IRefundModel, IRefundMethods>({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
})

export default RefundSchema;