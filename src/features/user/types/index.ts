import { Document, Model } from "mongoose";
import { IAddress } from "../../address/types";

export interface IUser {
  first_name: string;
  last_name: string;

  email: string;
  password: string;
  passwordChangedAt: number;

  passwordResetToken?: string;
  passwordResetTokenExpires?: number;
  passwordResetVerified?: boolean;

  mobile?: string;
  role: "user" | "vendor" | "admin";
  status: boolean;
  refreshToken: string;
  wishlist: string[];
  addresses: IAddress[]; // May separate as a new feature with its own model
  couponsUsed: string[];
}

export interface IUserMethods {
  comparePassword: (password: string) => Promise<boolean>;
  isTokenUpToDate: (tokenDate: number) => boolean;
  generateAccessToken: () => string;
  generateRefreshToken: () => Promise<string>;
  generatePasswordResetToken: () => string;
  comparePasswordResetTokenExpiration: (time: number) => boolean;
  isUsedCoupon: (couponId: string) => boolean;
}

export interface IUserDocument extends IUser, Document, IUserMethods {
  // here instance methods
}

export interface IUserModel extends Model<IUserDocument> {
  // here static methods
  findByEmail: (email: string) => Promise<IUserDocument>;
  getRefreshToken: (refreshToken: string) => string;
  getPasswordResetToken: (token: string) => string;
}
