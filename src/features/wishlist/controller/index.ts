import { NextFunction, Request, Response } from "express";
import { apiResponse, catchAsync } from "../../../common/helpers";
import ProductRepository from "../../products/repository";
import ErrorAPI from "../../../common/ErrorAPI";

class WishlistController {
  private productRepository: ProductRepository;
  constructor() {
    this.productRepository = new ProductRepository();
  }

  /**
   * @description Add product to wishlist
   * @method POST
   * @route /api/wishlist
   */
  create = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { user } = req;
      const { productId } = req.body;

      if (user.wishlist.includes(productId))
        return next(
          ErrorAPI.badRequest("You already have this product in wishlist")
        );

      user
        .updateOne({
          $push: { wishlist: productId },
        })
        .then((d) => apiResponse(res, 200, "Added to wishlist", d));
    }
  );

  /**
   * @description Remove product from wishlist
   * @method DELETE
   * @route /api/wishlist
   * @body productId
   */
  delete = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { user } = req;
      const { productId } = req.body;

      console.log("User Wishlist", user.wishlist);
      console.log("Is in", user.wishlist.includes(productId));

      if (!user.wishlist.includes(productId))
        return next(
          ErrorAPI.notFound("this product is not exist in wishlist before")
        );

      user
        .updateOne({
          $pull: { wishlist: productId },
        })
        .then((d) => apiResponse(res, 200, "Removed from wishlist", d));
    }
  );

  /**
   * @description Toggle product in wishlist
   * @method POST
   * @route /api/wishlist/toggle
   * @body productId
   */
  toggle = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    const { productId } = req.body;
    let status = "";

    if (user.wishlist.includes(productId)) {
      status = "removed";
      user.wishlist = user.wishlist.filter((id) => id !== productId);
    } else {
      status = "added";
      user.wishlist.push(productId);
    }

    user.save().then((d) => apiResponse(res, 200, `${status} in wishlist`, d));
  });

  /**
   * @description Fetch all products in wishlist
   * @method GET
   * @route /api/wishlist
   */
  read = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;
    const products = await this.productRepository.read({
      _id: { $in: user.wishlist },
    })
      .populate("category", "name")
      .select("-description -colors -brand -tags");

    return apiResponse(res, 200, "Wishlist fetched", { products });
  });

  /**
   * @description Fetch one product from wishlist
   * @method GET
   * @route /api/wishlist/:id
   * @param id
   */
  readOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { user } = req;
      const { id } = req.params;

      if (!user.wishlist.includes(id))
        return next(ErrorAPI.notFound("this product is not exist in wishlist"));

      const product = await this.productRepository.readOne({ _id: id });
      return apiResponse(res, 200, "Product fetched from wishlist", {
        product,
      });
    }
  );
}

export default new WishlistController();
