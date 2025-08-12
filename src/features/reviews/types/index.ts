import mongoose, { Model, Document, Schema } from "mongoose";

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: { [key: number]: number };
}

export interface IReview {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;

    title: string;
    review: string;
    stars: number;

    // New suggested fields
    verified?: boolean;           // Verified purchase badge
    helpful?: number;            // Helpful votes count
    notHelpful?: number;         // Not helpful votes count
    status: 'pending' | 'approved' | 'rejected';  // Moderation

    // images?: string[];           // Review images/videos URLs

    // reply?: {                    // Admin/seller reply
    //     content: string;
    //     author: mongoose.Types.ObjectId;
    //     createdAt: Date;
    // };

    createdAt?: Date;
    updatedAt?: Date;
}

export interface IReviewMethods { }

export interface IReviewDocument extends IReview, Document, IReviewMethods { }

export interface IReviewModel extends Model<IReviewDocument> {
    // Existing
    getAllReviewsOfUser: (userId: string) => Promise<IReviewDocument[]>;
    getAllUserReviewsOfProduct: (productId: string) => Promise<IReviewDocument[]>;

    // New suggested methods
    getProductReviewStats: (productId: string) => Promise<{
        averageRating: number;
        totalReviews: number;
        ratingBreakdown: { [key: number]: number };
    }>;

    getRecentReviews: (limit?: number) => Promise<IReviewDocument[]>;
    getMostHelpfulReviews: (productId: string, limit?: number) => Promise<IReviewDocument[]>;
    getVerifiedReviews: (productId: string) => Promise<IReviewDocument[]>;
    updateHelpfulVotes: (reviewId: string, isHelpful: boolean) => Promise<IReviewDocument>;
}