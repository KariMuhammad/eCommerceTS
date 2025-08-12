import APIRouter from "../../../common/Router";
import guardMiddleware from "../../auth/middleware/guard.middleware";
import RatingsController from "../controller";
import { setProductIdToBodyIfExist } from "../middleware/paramsMiddlewares";

const router = new APIRouter({ mergeParams: true });


router.resource("/reviews/", RatingsController, {
  all: [guardMiddleware.guard(), setProductIdToBodyIfExist],
});

export default router.getRouter();

// GET /api/reviews/:productId
// GET /api/reviews/:productId/stats
// POST /api/reviews [resource]
// PUT /api/reviews/:reviewId/helpful
// POST /api/reviews/:reviewId/reply
// GET /api/reviews/user/:userId
// PUT /api/reviews/:reviewId (edit review) [resource]
// DELETE /api/reviews/:reviewId [resource]