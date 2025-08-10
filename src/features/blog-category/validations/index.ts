import { body, validationResult } from "express-validator";
import Validations from "../../../common/Validations";
import Storage from "../../../common/Storage";

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
                .if((value, { req }) => !isUpdate || !!value)
                .optional()
                .customSanitizer((value, { req }) => {
                    if (Array.isArray(value)) return value[0];
                    return value;
                })
                .notEmpty().withMessage("image is empty!").bail(),

            body("images").custom((images: { url: string, public_id: string }[], { req }) => {
                if (!validationResult(req).isEmpty()) {
                    console.log("----images----", images);
                    Storage.memoryStorage().removeImagesFromStorage(images?.map((image) => image.public_id) ?? []);
                }

                return true;
            }),

            this.validate(),
        ]
    }

    create = () => this.mutate(false);
    update = () => this.mutate(true);
}