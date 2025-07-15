import { model } from "mongoose";
import RefundSchema from "./schema";
import { IRefundDocument } from "../types";

const RefundModel = model<IRefundDocument>("Refund", RefundSchema);


export default RefundModel;