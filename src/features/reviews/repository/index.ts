import { Request, Response } from "express";
import { catchAsync } from "../../../common/helpers";
import mongoose from "mongoose";
import ReviewModel from "../model";

// TODO: Implement Repository Layer for Review Services
// [Working on...]

class ReviewRepository {
    // ==========================================
    // PRODUCT-BASED REVIEW ROUTES
    // ==========================================

    /**
   * @route   GET /api/products/:productId/reviews
   * @desc    Get all reviews for a specific product
   * @access  Public
   */
    getProductReviews = catchAsync(async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;

            const { page = 1, limit = 10, sort = 'recent' } = req.query;

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }

            let reviews;

            switch (sort) {
                case 'helpful':
                    reviews = await ReviewModel.getMostHelpfulReviews(productId, Number(limit));
                    break;
                case 'verified':
                    reviews = await ReviewModel.getVerifiedReviews(productId);
                    break;
                default:
                    reviews = await ReviewModel.getAllUserReviewsOfProduct(productId);
            }

            // Pagination logic here if needed
            const startIndex = (Number(page) - 1) * Number(limit);
            const paginatedReviews = reviews.slice(startIndex, startIndex + Number(limit));

            res.json({
                success: true,
                data: paginatedReviews,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: reviews.length
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    /**
   * @route   GET /api/products/:productId/reviews/stats
   * @desc    Get review statistics for a product
   * @access  Public
   */
    getProductReviewsStats = catchAsync(async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }

            const stats = await ReviewModel.getProductReviewStats(productId);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    /**
     * @route   POST /api/products/:productId/reviews
     * @desc    Create a new review for a product
     * @access  Private (requires authentication)
     */
    createReviewForProduct = catchAsync(async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            const { title, review, stars, images = [] } = req.body;
            // const userId = req.user.id; // From authentication middleware

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }

            // Validate required fields
            if (!title || !review || !stars) {
                return res.status(400).json({
                    error: 'Title, review content, and stars are required'
                });
            }

            // Check if user already reviewed this product
            const existingReview = await ReviewModel.findOne({
                // user: userId,
                product: productId
            });

            if (existingReview) {
                return res.status(400).json({
                    error: 'You have already reviewed this product'
                });
            }

            const newReview = new ReviewModel({
                // user: userId,
                product: productId,
                title,
                review,
                stars: Number(stars),
                images,
                verified: false, // Will be set by admin/system
                status: 'pending'
            });

            await newReview.save();

            res.status(201).json({
                success: true,
                data: newReview,
                message: 'Review submitted successfully and is pending approval'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ==========================================
    // INDIVIDUAL REVIEW ROUTES
    // ==========================================

    /**
   * @route   GET /api/reviews/:reviewId
   * @desc    Get a specific review by ID
   * @access  Public
   */
    getReview = catchAsync(async (req: Request, res: Response) => {
        try {
            const { reviewId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(reviewId)) {
                return res.status(400).json({ error: 'Invalid review ID' });
            }

            const review = await ReviewModel.findById(reviewId)
                .populate('user', 'name avatar')
                .populate('product', 'name images price');

            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }

            res.json({
                success: true,
                data: review
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })

    /**
   * @route   PUT /api/reviews/:reviewId
   * @desc    Update a specific review
   * @access  Private (review owner only)
   */
    updateReview = catchAsync(async (req: Request, res: Response) => {
        try {
            const { reviewId } = req.params;
            const { title, review, stars, images } = req.body;
            // const userId = req.user.id; // From authentication middleware

            if (!mongoose.Types.ObjectId.isValid(reviewId)) {
                return res.status(400).json({ error: 'Invalid review ID' });
            }

            const existingReview = await ReviewModel.findById(reviewId);

            if (!existingReview) {
                return res.status(404).json({ error: 'Review not found' });
            }

            // Check if user owns this review
            // if (existingReview.user.toString() !== userId) {
            //     return res.status(403).json({ error: 'Not authorized to update this review' });
            // }

            const updatedReview = await ReviewModel.findByIdAndUpdate(
                reviewId,
                {
                    title,
                    review,
                    stars: Number(stars),
                    images,
                    status: 'pending' // Reset to pending after edit
                },
                { new: true }
            );

            res.json({
                success: true,
                data: updatedReview,
                message: 'Review updated successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })

    /**
   * @route   DELETE /api/reviews/:reviewId
   * @desc    Delete a specific review
   * @access  Private (review owner or admin)
   */
    deleteReview = catchAsync(async (req: Request, res: Response) => {
        try {
            const { reviewId } = req.params;
            // const userId = req.user.id;
            // const isAdmin = req.user.role === 'admin';

            if (!mongoose.Types.ObjectId.isValid(reviewId)) {
                return res.status(400).json({ error: 'Invalid review ID' });
            }

            const review = await ReviewModel.findById(reviewId);

            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }

            // Check authorization
            // if (review.user.toString() !== userId && !isAdmin) {
            //     return res.status(403).json({ error: 'Not authorized to delete this review' });
            // }

            await ReviewModel.findByIdAndDelete(reviewId);

            res.json({
                success: true,
                message: 'Review deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ==========================================
    // USER-BASED REVIEW ROUTES
    // ==========================================

    /**
   * @route   GET /api/users/:userId/reviews
   * @desc    Get all reviews by a specific user
   * @access  Public
   */
    getReviewsOfUser = catchAsync(async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            const reviews = await ReviewModel.getAllReviewsOfUser(userId);

            // Pagination
            const startIndex = (Number(page) - 1) * Number(limit);
            const paginatedReviews = reviews.slice(startIndex, startIndex + Number(limit));

            res.json({
                success: true,
                data: paginatedReviews,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: reviews.length
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ==========================================
    // ADMIN ROUTES
    // ==========================================

    /**
   * @route   GET /api/admin/reviews/pending
   * @desc    Get all pending reviews for moderation
   * @access  Admin only
   */
    updateReviewStatus = catchAsync(async (req: Request, res: Response) => {
        try {
            const { reviewId } = req.params;
            const { status, verified = false } = req.body;

            if (!mongoose.Types.ObjectId.isValid(reviewId)) {
                return res.status(400).json({ error: 'Invalid review ID' });
            }

            if (!['pending', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            const updatedReview = await ReviewModel.findByIdAndUpdate(
                reviewId,
                { status, verified },
                { new: true }
            );

            if (!updatedReview) {
                return res.status(404).json({ error: 'Review not found' });
            }

            res.json({
                success: true,
                data: updatedReview,
                message: `Review ${status} successfully`
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })
}