import { Router } from "express";
import AuthController from "../controller/auth.controller";
import AuthValidations from "../validation";
import guardMiddleware from "../middleware/guard.middleware";
import { apiResponse } from "../../../common/helpers";
import authController from "../controller/auth.controller";
import userController from "../../user/controller/user.controller";

const router = Router();

// ===================== Public Route =====================

router.post(
  "/register",
  guardMiddleware.reverseGuard(),
  AuthValidations.getInstance().register(),
  AuthController.register
);

// Endpoint for create admin vendor user
router.post(
  "/register-admin",
  guardMiddleware.reverseGuard(),
  AuthValidations.getInstance().register(),
  AuthController.registerVendor
);

router.post("/login", guardMiddleware.reverseGuard(), AuthController.login);

// ===================== Protected Route =====================
router.post("/refresh", AuthController.refreshToken);

router.post("/logout", guardMiddleware.guard(), AuthController.logout);

router.post(
  "/forgot-password",
  guardMiddleware.reverseGuard(),
  authController.forgotPassword
);

router.get(
  "/reset-password-verification",
  guardMiddleware.reverseGuard(),
  authController.resetPasswordVerify
);

router.post(
  "/reset-password",
  guardMiddleware.reverseGuard(),
  authController.resetPassword
);

router.patch(
  "/change-password",
  guardMiddleware.guard(),
  AuthValidations.getInstance().changePassword(),
  AuthController.changePassword
);

router.patch(
  "/change-address",
  guardMiddleware.guard(),
  userController.changeAddress
);

router.get("/profile", guardMiddleware.guard(), AuthController.profile);

router.post(
  "/profile/add-address",
  guardMiddleware.guard(),
  userController.addAddress
);

router.get("/test-admin", guardMiddleware.adminGuard(), (req, res) =>
  apiResponse(res, 200, "OK")
);

export default router;
