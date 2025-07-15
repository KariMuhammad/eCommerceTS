import { Document, Model, Schema } from "mongoose";
import { RefundStatus } from "../../../common/constants";

export interface IRefund extends Document {
    id: string;
    orderId: Schema.Types.ObjectId;
    amount: number;
    status: RefundStatus;
    createdAt: Date;
    updatedAt: Date;
}


export interface IRefundMethods {
    approve(): void;
    reject(): void;
    isExpired(): boolean;
}

export interface IRefundDocument extends IRefund, IRefundMethods {}

export interface IRefundModel extends Model<IRefundDocument> {
    findByOrderId(orderId: string): IRefundDocument[]
}