import { Schema } from "mongoose";
import { IUserMethods, IUserModel, IUser as IUserType } from "../types";

const UserSchema = new Schema<IUserType, IUserModel, IUserMethods>({
  first_name: {
    type: String,
    required: true,
  },

  last_name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  // emailVerifiedAt: {
  //   type: Date,
  // },

  password: {
    type: String,
    required: true,
  },

  passwordChangedAt: {
    type: Number,
    required: true,
    default: Date.now(),
  },

  passwordResetToken: String,
  passwordResetTokenExpires: Number,
  passwordResetVerified: Boolean,

  mobile: {
    type: String,
  },

  role: {
    type: String,
    default: "user",
  },

  status: {
    type: Boolean,
    default: true,
  },

  refreshToken: {
    type: String,
  },

  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  addresses: [
    {
      address: String,
    },
  ],

  couponsUsed: [
    {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
  ],
});

export type IUser = IUserType;

export default UserSchema;
