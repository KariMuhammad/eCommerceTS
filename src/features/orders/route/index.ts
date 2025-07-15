import APIRouter from "../../../common/Router";
import guardMiddleware from "../../auth/middleware/guard.middleware";
import OrderController from "../controller";

const router = new APIRouter();

const orderController = new OrderController();

router
  .getRouter()
  .get("/admin", guardMiddleware.adminGuard(), orderController.readAll);

router.resource("/", orderController, {
  all: [guardMiddleware.guard()],
});

export default router.getRouter();
