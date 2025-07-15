import { body } from "express-validator";
import Validations from "../../../common/Validations";

export default class BlogCategoryValidation extends Validations {
    mutate = (isUpdate = false) => {
        return [
            body("name")
            .if(() => !isUpdate)
            .notEmpty()
            .withMessage("name category is required")
            .bail()
            .isLength({ min: 3 })
            .withMessage("name category must has 3 characters at least!"),

            body("description")
            .if(() => !isUpdate)
            .optional()
            .isLength({ min: 10 })
            .withMessage("description must has at least 10 characters"),

            body("image")
            .if(() => !isUpdate)
            .optional()
            .customSanitizer((value, { req }) => {
                if (Array.isArray(value)) return value[0];
                return value;
            })
            .notEmpty().withMessage("image is empty!").bail()
        ]
    }

    create = () => this.mutate(false);
    update = () => this.mutate(true);
}