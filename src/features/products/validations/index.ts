import { body, validationResult } from "express-validator";
import Validations from "../../../common/Validations";
import CategoryModel from "../../category/models";
import ErrorAPI from "../../../common/ErrorAPI";
import BrandModel from "../../brands/models";
import Storage from "../../../common/Storage";
import ProductModel from "../model";

class ProductValidations extends Validations {
  private mutate(isUpdate = false) {
    return [
      // Convert and validate price
      body("price")
        .if(() => !isUpdate)
        .notEmpty()
        .withMessage("'price' is required")
        .bail()
        .customSanitizer((value) => {
          // Convert string to number for FormData
          const num = parseFloat(value);
          return isNaN(num) ? value : num;
        })
        .isFloat({ min: 0 })
        .withMessage("'price' must be a positive number")
        .bail(),

      // Convert and validate quantity
      body("quantity")
        .if(() => !isUpdate)
        .notEmpty()
        .withMessage("'quantity' is required")
        .bail()
        .customSanitizer((value) => {
          // Convert string to integer for FormData
          const num = parseInt(value);
          return isNaN(num) ? value : num;
        })
        .isInt({ min: 1 })
        .withMessage("'quantity' must be a positive number")
        .bail(),

      // Parse and validate images array
      body("images")
        .if(() => !isUpdate)
        .notEmpty()
        .withMessage("'images' is required")
        .bail()
        .customSanitizer((value) => {
          // Content-Type if JSON
          return Array.isArray(value) ? value : [value];
        })
        .isArray()
        .withMessage("'images' must be an array")
        .custom((images) => {
          if (!Array.isArray(images)) {
            throw ErrorAPI.badRequest("'images' must be an array");
          }

          images.forEach((image, index) => {
            if (!image) {
              throw ErrorAPI.badRequest(`Image at index ${index} is required`);
            }
          });

          return true;
        }),

      // Parse and validate colors array
      body("colors")
        .if(() => !isUpdate)
        .optional()
        .customSanitizer((value) => {
          // Handle FormData array parsing
          if (typeof value === 'string') {
            try {
              return JSON.parse(value);
            } catch {
              return []; // TODO: Check Will return array in all cases?
            }
          }

          // Content-Type if JSON
          return Array.isArray(value) ? value : [];
        })
        .isArray().isLength({ min: 1 })
        .withMessage("'colors' must be an array")
        .custom((colors) => {
          if (!Array.isArray(colors)) {
            throw ErrorAPI.badRequest("Colors is not an array!");
          }

          colors.forEach((color, index) => {
            if (!color.name || !color.hexCode || !color.quantity) {
              throw ErrorAPI.badRequest(
                `Color at index ${index} must have name, hexCode, and quantity`
              );
            }

            // Convert quantity to number
            const quantity = parseInt(color.quantity);
            if (isNaN(quantity) || quantity < 0) {
              throw ErrorAPI.badRequest(
                `Color quantity at index ${index} must be a positive number`
              );
            }
          });

          return true;
        }),

      // Parse and validate tags array
      body("tags")
        .if(() => !isUpdate)
        .notEmpty()
        .withMessage("'tags' is required")
        .bail()
        .customSanitizer((value) => {
          // Handle FormData array parsing
          if (typeof value === 'string') {
            try {
              return JSON.parse(value);
            } catch {
              // If it's not JSON, treat as single item array
              return [value];
            }
          }

          // Content-Type if JSON
          return Array.isArray(value) ? value : [value];
        })
        .isArray()
        .withMessage("'tags' must be an array")
        .custom((tags) => {
          if (!Array.isArray(tags)) {
            throw ErrorAPI.badRequest("'tags' must be an array");
          }

          tags.forEach((tag, index) => {
            if (!tag) {
              throw ErrorAPI.badRequest(`Tag at index ${index} is required`);
            }
          });

          return true;
        }),

      // Validate name (after price and quantity to avoid conflicts)
      body("name")
        .if(() => !isUpdate)
        .notEmpty()
        .withMessage("'name' is required")
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage("'name' length (min: 3, max: 100)")
        .bail()
        .custom(async (value) => {
          const isExist = await ProductModel.findOne({ name: value });
          if (isExist)
            throw ErrorAPI.badRequest("Product name is already be taken!");

          return true;
        }),

      // Validate description
      body("description")
        .if(() => !isUpdate)
        .notEmpty()
        .withMessage("'description' is required")
        .bail()
        .isLength({ min: 50 })
        .withMessage("'description' length (min: 50, max: inf)")
        .bail(),

      // Validate category
      body("category")
        .if(() => !isUpdate)
        .notEmpty()
        .withMessage("'category' is required")
        .custom(async (value) => {
          const category = await CategoryModel.findById(value);
          if (!category)
            throw ErrorAPI.badRequest("This CategoryID is not exist!");

          return true;
        }),

      // Validate brand
      body("brand")
        .if(() => !isUpdate)
        .notEmpty()
        .withMessage("'brand' is required")
        .custom(async (value) => {
          const brand = await BrandModel.findById(value);
          if (!brand) throw ErrorAPI.badRequest("this BrandID is not exist!");

          return true;
        }),

      // Cleanup images on validation failure
      body("images").custom((images: { url: string, public_id: string }[], { req }) => {
        if (!validationResult(req).isEmpty()) {
          console.log("----images----", images);
          Storage.memoryStorage().removeImagesFromStorage(images?.map((image) => image.public_id) ?? []);
        }

        return true;
      }),

      this.validate(),
    ];
  }

  create() {
    return this.mutate(false);
  }

  update() {
    return this.mutate(true);
  }
}

export default new ProductValidations();
