import mongoose, { Schema } from "mongoose";
import { IReview, IReviewMethods, IReviewModel } from "../types";

const ReviewSchema = new Schema<IReview, IReviewModel, IReviewMethods>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    title: {
        type: String,
        required: true
    },

    stars: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },

    review: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: "pending",
    },

    verified: {
        type: Boolean,
        default: false,
    },

    helpful: {
        type: Number, // Number of helpful Votes
        default: 0,
    },

    notHelpful: {
        type: Number,
        default: 0,
    },

    // reply

    // Image Uploading
    // images: { type: [String], }

}, { timestamps: true })

ReviewSchema.index({ product: 1, status: 1 });
ReviewSchema.index({ product: 1, stars: -1 });
ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ user: 1 });


export default ReviewSchema;