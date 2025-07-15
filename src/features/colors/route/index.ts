import APIRouter from "../../../common/Router";
import guardMiddleware from "../../auth/middleware/guard.middleware";
import ColorController from "../controller/color.controller";

const router = new APIRouter();

router.resource("/", new ColorController(), {
  all: [guardMiddleware.adminGuard()],
});

export default router.getRouter();
