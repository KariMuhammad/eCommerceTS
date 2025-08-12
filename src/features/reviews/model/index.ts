import { model } from "mongoose";
import ReviewSchema from "./schema";
import { IReviewDocument, IReviewModel } from "../types";

import "./static";

const ReviewModel = model<IReviewDocument, IReviewModel>("Review", ReviewSchema);

export default ReviewModel;