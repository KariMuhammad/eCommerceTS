import APIRouter from "../../../common/Router";
import guardMiddleware from "../../auth/middleware/guard.middleware";
import CategoryController from "../controller";

import Storage from "../../../common/Storage";
import categoryValidations from "../validations";

const storage = Storage.memoryStorage();
const filedsToUpload = storage.getFileFields({ image: 1 });

const router = new APIRouter();

router.resource("/", CategoryController, {
  create: [
    guardMiddleware.adminGuard(),
    storage.upload.fields(filedsToUpload),
    storage.prepareUploadFiles(filedsToUpload),
    ...categoryValidations.create()
  ],
  
  update: [
    guardMiddleware.adminGuard(),
    storage.upload.fields(filedsToUpload),
    storage.prepareUploadFiles(filedsToUpload),
    ...categoryValidations.update(),
  ],
  delete: [guardMiddleware.adminGuard()],
});

export default router.getRouter();
