import APIRouter from "../../../common/Router";
import Storage from "../../../common/Storage";

import guardMiddleware from "../../auth/middleware/guard.middleware";

import ProductController from "../controller";
import ProductValidation from "../validations";

import reviewsRoute from "../../reviews/route";

const router = new APIRouter();
const storage = Storage.memoryStorage();
const fileFields = storage.getFileFields({ images: 5 });

router.getRouter().get("/s/:slug", ProductController.getBySlugProduct)

router.resource("/", ProductController, {
  create: [
    guardMiddleware.guard(),
    guardMiddleware.only(["admin", "vendor"]),
    storage.upload.fields(fileFields),
    storage.prepareUploadFiles(fileFields),
    ...ProductValidation.create(),
  ],
  update: [
    guardMiddleware.guard(),
    guardMiddleware.only(["admin", "vendor"]),
    storage.upload.fields(fileFields),
    storage.prepareUploadFiles(fileFields),
    ...ProductValidation.update(),
  ],
  delete: [guardMiddleware.guard(), guardMiddleware.only(["admin", "vendor"])],
});

// router.getRouter().delete("/:productId/image", ProductController.deleteImage);

// Reviews & Ratings
router.getRouter().use("/:productId", reviewsRoute);

export default router.getRouter();
