import { body } from "express-validator";
import Validations from "../../../common/Validations";
import CategoryModel from "../models";
import ErrorAPI from "../../../common/ErrorAPI";

class CategoryValidations extends Validations {
    private mutate(isUpdate = false) {
        return [

            body("name")
                .if(() => !isUpdate)
                .notEmpty()
                .withMessage("'name' is required")
                .bail()
                .isLength({ min: 3, max: 50 })
                .withMessage("'name' length (min: 3, max: 50)")
                .bail()
                .custom(async (value) => {
                    const isExist = await CategoryModel.findOne({ name: value });
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

            body("image")
                .optional()
                .customSanitizer((value, { req }) => {
                    if (Array.isArray(value))
                        return value[0]
                    return value;
                })
                .notEmpty()
                .withMessage("image field is required")
                .bail()
        ]
    }
    create() {
        return this.mutate(false);
    }
    update() {
        return this.mutate(true);
    }
}

const categoryValidations = new CategoryValidations();
export default categoryValidations;