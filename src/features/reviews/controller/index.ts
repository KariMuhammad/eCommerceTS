import { NextFunction, Request, Response } from "express";
import { apiResponse, catchAsync } from "../../../common/helpers";
import ProductRepository from "../../products/repository";
import ErrorAPI from "../../../common/ErrorAPI";
import ReviewModel from "../model";
import mongoose from "mongoose";

class RatingsController {
  constructor() { }

  /**
   * @description Get all ratings of a product
   * @method GET
   * @route /api/products/:productId?/reviews
   */
  read = catchAsync(async (req: Request, res: Response) => {
    const reviews = await ReviewModel.find(req.body || {})
      .populate("user", "first_name last_name email")
      .populate("product", "name images price");

    // TODO: Validation Layer for `productId` of parent route and `reviewId`

    let stats = {};
    if (req.body.product)
      stats = await ReviewModel.getProductReviewStats(req.body.product);

    return apiResponse(res, 200, "Fetched All Reviews", { reviews, stats });
  });

  /**
   * @description Get one rating of a product
   * @method GET
   * @route /api/products/:productId/ratings/:id
   */
  readOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const query = { _id: id };

      const { product } = req.body;
      if (product) query["product"] = product;

      const review = await ReviewModel.find(query)
        .populate("product", "name price")
        .populate("user", "first_name last_name email");

      return apiResponse(res, 200, "Review fetched successfully", review);
    }
  );

  /**
   * @description Create a new rating for a product
   * @method POST
   * @route /api/products/:productId/reviews
   */
  create = catchAsync(async (req: Request, res: Response) => {
    console.log("Create Rating");

    const { user, body } = req;
    const { product } = body;

    console.log("User ID", user.id);
    console.log("Product ID", product);

    // TODO: Validation Layer for `request.body`

    // Check if User already wrote a review for same product
    const review = await ReviewModel.find({ user: new mongoose.Types.ObjectId(user.id), product: new mongoose.Types.ObjectId(product) });
    if (review)
      throw ErrorAPI.badRequest("You already wrote a review in this product");

    const newReview = await ReviewModel.create({
      ...body,
      user: req.user.id
    });

    return apiResponse(res, 201, "Review created successfully", newReview);
  });

  /**
   * @description Update a rating of a product
   * @method PATCH
   * @route /api/products/:productId/reviews/:id
   */
  update = catchAsync(async (req: Request, res: Response) => {
    const { user, body, params } = req;

    const { id: reviewId } = params;
    const { product, ...data } = body;

    const updatedReview = await ReviewModel.findOneAndUpdate({
      user: user.id,
      _id: reviewId,
      product: product ?? undefined
    }, {
      $set: data
    }, { new: true })

    if (!updatedReview) {
      throw ErrorAPI.notFound("Reivew is not exist!");
    }

    return apiResponse(res, 200, "Rating updated successfully", updatedReview);
  });

  /**
   * @description Delete a rating of a product
   * @method DELETE
   * @route /api/products/:productId/reviews/:id
   */
  delete = catchAsync(async (req: Request, res: Response) => {
    const { user, body } = req;
    const { id: reviewId } = req.params;

    const deletedReview = await ReviewModel.findOneAndDelete({
      _id: reviewId,
      user: user.id,
      product: body.product ?? undefined
    })

    if (!deletedReview) {
      throw ErrorAPI.notFound("Review is not exist!");
    }

    return apiResponse(res, 204, "Rating deleted successfully");
  });
}

export default new RatingsController();
