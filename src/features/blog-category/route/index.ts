import APIRouter from "../../../common/Router";
import Storage from "../../../common/Storage";
import mongoIdValidations from "../../common/validations/route-validations/mongoId-validations";
import blogCategoryController from "../controller";
import BlogCategoryModel from "../model";
import BlogCategoryValidation from "../validations";
const router = new APIRouter();

// Setup Upload Files
const storage = Storage.memoryStorage();
const fileField = storage.getFileFields({ image: 1 });

router.resource("/", blogCategoryController, {
    create: [
        storage.upload.fields(fileField),
        storage.prepareUploadFiles(fileField),
        ...(new BlogCategoryValidation).create(),
    ],

    update: [
        ...mongoIdValidations.isMongoIdExist("id", BlogCategoryModel),
        storage.upload.fields(fileField),
        storage.prepareUploadFiles(fileField),
        ...(new BlogCategoryValidation).update(),
    ],

    delete: [
        ...mongoIdValidations.isMongoIdExist("id", BlogCategoryModel),
    ],

    readOne: [
        ...mongoIdValidations.isMongoIdExist("id", BlogCategoryModel),
    ]
});

export default router.getRouter();