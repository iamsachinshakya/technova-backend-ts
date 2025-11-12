import express from "express";
import { ControllerProvider } from "../../../ControllerProvider";
import { validateBody } from "../../../common/middlewares/validate.middleware";
import { registerUserSchema } from "../../users/validations/user.validation";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { authenticateJWT } from "../../../common/middlewares/auth.middleware";


const router = express.Router();
const authController = ControllerProvider.authController;

router.route("/register").post(
  validateBody(registerUserSchema),
  asyncHandler(authController.register.bind(authController)),
);

router
  .route("/login")
  .post(asyncHandler(authController.login.bind(authController)));
router
  .route("/refresh-token")
  .post(asyncHandler(authController.refreshAccessToken.bind(authController)));

//secured routes
router
  .route("/logout")
  .post(
    authenticateJWT,
    asyncHandler(authController.logout.bind(authController))
  );

router
  .route("/change-password")
  .post(
    authenticateJWT,
    asyncHandler(authController.changePassword.bind(authController))
  );

export const authRouter = router;
