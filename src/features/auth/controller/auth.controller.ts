import fs from "fs";

import { Request, response, Response } from "express";
import ErrorAPI from "../../../common/ErrorAPI";
import { apiResponse, catchAsync } from "../../../common/helpers";
import UserRepository from "../../user/repository";
import JwtServices from "./../service/jwt.services";
import { REFRESH_TOKEN } from "../../../common/constants";
import UserModel from "../../user/model";
import config from "../../../../config";
import sendEmail from "../../../common/email.service";

class UserController {
  private readonly userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  register = async (req: Request, res: Response, next) => {
    try {
      await this.userRepository.create(req.body);

      return apiResponse(res, 201, "User Created Successfully!");
    } catch (error) {
      next(ErrorAPI.internal(error.message));
    }
  };

  registerVendor = async (req: Request, res: Response, next) => {
    try {
      await this.userRepository.create({
        ...req.body,
        role: "vendor",
      });

      return response.status(201).json({
        status: "success",
        message: "Vendor Created Successfully!",
      });
    } catch (error) {
      next(ErrorAPI.internal(error.message));
    }
  };

  login = async (req: Request, res: Response, next) => {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.readOne({ email });
      if (!user) return next(ErrorAPI.notFound("Credentials is wrong!"));

      // we can separate this logic to middleware
      if (!JwtServices.isExpired(user.refreshToken))
        return next(ErrorAPI.badRequest("Already logged in"));

      if (!user || !(await user.comparePassword(password))) {
        return next(ErrorAPI.unauthorized("Invalid Credentails!"));
      }

      const token = user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

      res.cookie(REFRESH_TOKEN.name, refreshToken, REFRESH_TOKEN.options);

      return apiResponse(res, 200, "Login Successfully!", {
        token,
        username: `${user.first_name} ${user.last_name}`,
        email: user.email,
        mobile: user.mobile,
      });

      /**
       * AccessToken used directly by client users
       * RefreshToken used only when accessToken expired instead of logout and re-login again
       */
    } catch (error) {
      next(ErrorAPI.internal(error.message));
    }
  };

  profile = async (req: Request, res: Response, next) => {
    console.log(req.user);
    try {
      return apiResponse(res, 200, "Profile Data", req.user);
    } catch (error) {
      next(ErrorAPI.internal(error.message));
    }
  };

  refreshToken = async (req: Request, res: Response, next) => {
    try {
      const cookies = req.cookies;
      console.log("Cookies", cookies);

      if (!cookies["refresh_token"])
        return next(
          ErrorAPI.badRequest(
            "There is no Refresh token in cookies (not found)"
          )
        );

      const refreshToken = cookies["refresh_token"];
      const rTknHash = UserModel.getRefreshToken(refreshToken);
      const user = await this.userRepository.readOne({
        refreshToken: rTknHash,
      });
      if (!user)
        return next(
          ErrorAPI.notFound(
            "Refresh token no longer belong to any user (not found)"
          )
        );

      const decodedToken = JwtServices.verify(refreshToken, config.refresh_key);
      if (decodedToken.id !== user.id)
        return next(
          ErrorAPI.unauthorized("Unauthorized behaviour! (id not match)")
        );

      const newAccessToken = user.generateAccessToken();

      return apiResponse(res, 200, "New Access Token returned", {
        token: newAccessToken,
      });
    } catch (error) {
      next(ErrorAPI.internal(error.message));
    }
  };

  logout = async (req: Request, res: Response, next) => {
    try {
      const currentUser = req.user;

      const cookies = req.cookies;
      if (!cookies["refresh_token"])
        return next(
          ErrorAPI.badRequest(
            "Refresh tokens is not exist! (you already logged out)"
          )
        );

      const refreshToken = cookies["refresh_token"];

      const user = await this.userRepository.readOne({ _id: currentUser.id });
      if (!user)
        return next(
          ErrorAPI.badRequest("Please Login first again! (user not found)")
        );
      if (user.refreshToken !== refreshToken)
        return next(
          ErrorAPI.unauthorized(
            "Unauthorized Behaviour! (refresh token not match)"
          )
        );

      user.refreshToken = "";
      await user.save();

      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        maxAge: 0,
      });

      return apiResponse(res, 204, "Logout successfully!");
    } catch (error) {
      next(ErrorAPI.internal(error.message));
    }
  };

  changePassword = async (req: Request, res: Response, next) => {
    const currentUser = req.user;

    try {
      const user = await new UserRepository()
        .readOne({
          _id: currentUser.id,
        })
        .select("password");

      if (!(await user.comparePassword(req.body["old-password"]))) {
        return next(
          ErrorAPI.badRequest("Old password you have entered is incorrect")
        );
      }

      // 1# first
      user.password = req.body["new-password"];
      await user.save();

      // then, 2# second
      const token = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      res.clearCookie(REFRESH_TOKEN.name, {
        ...REFRESH_TOKEN.options,
        maxAge: 0,
      });
      res.cookie(REFRESH_TOKEN.name, refreshToken, REFRESH_TOKEN.options);

      return apiResponse(res, 200, "You changed the password successfully", {
        token,
      });
    } catch (error) {
      next(ErrorAPI.internal(error.message));
    }
  };

  forgotPassword = catchAsync(async (req: Request, res: Response, next) => {
    const { email } = req.body;
    const user = await this.userRepository.readOne({ email });

    if (!user) return next(ErrorAPI.notFound("User not found"));

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    sendEmail({
      from: config.mail_account,
      to: email,
      subject: "Password Reset",
      text: "Forgot Password",
      body: fs
        .readFileSync(
          `${config.root}/src/templates/forgot-password.html`,
          "utf-8"
        )
        .replace("{{ email }}", config.mail_account)
        .replace("{{ token }}", resetToken)
        .replace(
          "{{ url }}",
          `${config.server}/auth/reset-password-verification?token=${resetToken}`
        ),
    })
      .then(() => {
        return apiResponse(res, 200, "Reset password link sent to your email");
      })
      .catch((error) => {
        next(ErrorAPI.internal(error.message));
      });
  });

  resetPasswordVerify = catchAsync(
    async (req: Request, res: Response, next) => {
      console.log("Token", req.query.token);
      const token = req.query.token as string;

      const user = await this.userRepository.readOne({
        passwordResetToken: UserModel.getPasswordResetToken(token),
        passwordResetTokenExpires: { $gt: Date.now() },
      });
      if (!user) return next(ErrorAPI.notFound("No exists (auth issue)!"));

      user.passwordResetVerified = true;

      await user.save();

      return apiResponse(res, 200, "You can now change your password");
    }
  );

  resetPassword = catchAsync(async (req: Request, res: Response, next) => {
    const { password } = req.body;
    const token = req.query.token as string;

    const user = await this.userRepository.readOne({
      passwordResetToken: UserModel.getPasswordResetToken(token),
      passwordResetTokenExpires: { $gt: Date.now() },
      passwordResetVerified: true,
    });

    if (!user) return next(ErrorAPI.unauthorized("Authorization Issue"));

    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordResetVerified = false;

    user.password = password;
    await user.save();

    return apiResponse(res, 200, "New passwored is set");
  });
}

export default new UserController();
