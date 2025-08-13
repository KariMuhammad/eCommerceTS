import mongoose from "mongoose";
import ReviewSchema from "./schema";
import { IReviewDocument, ReviewStats } from "../types";


// Static Methods Implementation
ReviewSchema.statics.getAllReviewsOfUser = async function (userId: string): Promise<IReviewDocument[]> {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }

        const reviews = await this.find({
            user: new mongoose.Types.ObjectId(userId)
        })
            .populate('product', 'name images price') // Populate product details
            .sort({ createdAt: -1 }) // Most recent first
            .exec();

        return reviews;
    } catch (error) {
        throw new Error(`Error fetching user reviews: ${error.message}`);
    }
};

ReviewSchema.statics.getAllUserReviewsOfProduct = async function (productId: string): Promise<IReviewDocument[]> {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        const reviews = await this.find({
            product: new mongoose.Types.ObjectId(productId),
            status: 'approved' // Only show approved reviews
        })
            .populate('user', 'name avatar') // Populate user details
            .sort({ createdAt: -1 }) // Most recent first
            .exec();

        return reviews;
    } catch (error) {
        throw new Error(`Error fetching product reviews: ${error.message}`);
    }
};

ReviewSchema.statics.getProductReviewStats = async function (productId: string): Promise<ReviewStats> {
    console.log("Product ID", productId);

    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        const stats = await this.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId),
                    status: 'approved'
                }
            },
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$stars' },
                    ratingBreakdown: {
                        $push: '$stars'
                    }
                }
            }
        ]);

        if (stats.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }

        const result = stats[0];

        // Calculate rating breakdown
        const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        result.ratingBreakdown.forEach((rating: number) => {
            ratingBreakdown[rating]++;
        });

        return {
            averageRating: Math.round(result.averageRating * 10) / 10, // Round to 1 decimal
            totalReviews: result.totalReviews,
            ratingBreakdown
        };
    } catch (error) {
        throw new Error(`Error fetching review stats: ${error.message}`);
    }
};

ReviewSchema.statics.getRecentReviews = async function (limit: number = 10): Promise<IReviewDocument[]> {
    try {
        const reviews = await this.find({ status: 'approved' })
            .populate('user', 'name avatar')
            .populate('product', 'name images')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();

        return reviews;
    } catch (error) {
        throw new Error(`Error fetching recent reviews: ${error.message}`);
    }
};

ReviewSchema.statics.getMostHelpfulReviews = async function (productId: string, limit: number = 5): Promise<IReviewDocument[]> {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        // For now, we'll sort by verified reviews first, then by rating
        // Later you can integrate with ReviewVote collection for actual helpful votes
        const reviews = await this.find({
            product: new mongoose.Types.ObjectId(productId),
            status: 'approved'
        })
            .populate('user', 'name avatar')
            .sort({
                verified: -1,  // Verified reviews first
                stars: -1,     // Higher ratings first
                createdAt: -1  // Most recent first
            })
            .limit(limit)
            .exec();

        return reviews;
    } catch (error) {
        throw new Error(`Error fetching helpful reviews: ${error.message}`);
    }
};

ReviewSchema.statics.getVerifiedReviews = async function (productId: string): Promise<IReviewDocument[]> {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        const reviews = await this.find({
            product: new mongoose.Types.ObjectId(productId),
            status: 'approved',
            verified: true
        })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .exec();

        return reviews;
    } catch (error) {
        throw new Error(`Error fetching verified reviews: ${error.message}`);
    }
};

ReviewSchema.statics.getApprovedReviews = async function (productId: string): Promise<IReviewDocument[]> {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        const reviews = await this.find({
            product: new mongoose.Types.ObjectId(productId),
            status: 'approved'
        })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .exec();

        return reviews;
    } catch (error) {
        throw new Error(`Error fetching approved reviews: ${error.message}`);
    }
};

// Instance methods (if needed)
ReviewSchema.methods.isVerified = function (): boolean {
    return this.verified === true;
};

ReviewSchema.methods.isApproved = function (): boolean {
    return this.status === 'approved';
};

// Usage Examples:
/*
// Get all reviews by a user
const userReviews = await Review.getAllReviewsOfUser(userId);

// Get all reviews for a product
const productReviews = await Review.getAllUserReviewsOfProduct(productId);

// Get product statistics
const stats = await Review.getProductReviewStats(productId);
console.log(stats); // { averageRating: 4.2, totalReviews: 15, ratingBreakdown: { 1: 0, 2: 1, 3: 2, 4: 5, 5: 7 } }

// Get recent reviews across all products
const recentReviews = await Review.getRecentReviews(20);

// Get most helpful reviews for a product
const helpfulReviews = await Review.getMostHelpfulReviews(productId, 10);

// Get only verified reviews
const verifiedReviews = await Review.getVerifiedReviews(productId);
*/