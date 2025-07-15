import { Types } from "mongoose";
import UserModel from "../../user/model";
import { DiscountType } from "../types";
import { CouponSchema } from "./schema";

CouponSchema.methods.isExpired = function () {
  return this.expiredAt < new Date();
};

CouponSchema.methods.use = async function (
  user: Types.ObjectId,
  total: number
) {
  if (this.isExpired()) {
    this.isActive = false;
    //! throw new Error("Coupon is expired");
    throw new Error("Coupon is expired");
    await this.save();
    return total;
  }

  /**
   * @desc if coupon isActive false because totalUsageCount >= usageLimit, but still expiredAt is not reached
   * first users who used this coupon before the limit reached can still use it
   */

  const isUsedByUserBefore = await this.usedBy(user);

  if (this.isActive === false) {
    if (isUsedByUserBefore === false) {
      throw new Error("Coupon no longer accept new users");
    }
  }

  if (this.discountType === DiscountType.PERCENTAGE) {
    total = total - (total * this.discount) / 100;
  }

  if (this.discountType === DiscountType.FIXED) {
    total = total - this.discount;
  }

  // increase when new user uses this coupon
  if (!isUsedByUserBefore) this.usageCount += 1;

  if (this.usageCount >= this.usageLimit) {
    this.isActive = false;
    // or delete
  }

  await this.save();

  return total;
};

CouponSchema.methods.usedBy = async function (user: Types.ObjectId) {
  const clientUser = await UserModel.findById(user);

  if (clientUser.couponsUsed.includes(this._id)) return true;
  else {
    clientUser.couponsUsed.push(this._id);
    await clientUser.save();

    return false;
  }
};

CouponSchema.methods.destroy = async function () {
  await UserModel.updateMany(
    { couponsUsed: this._id },
    { $pull: { couponsUsed: this._id } }
  );

  this.deleteOne().then(() => {
    console.log("Coupon deleted successfully");
    return;
  });
};

CouponSchema.methods.useWithDestroy = async function (total: number) {
  if (this.discountType === DiscountType.PERCENTAGE) {
    total = total - (total * this.discount) / 100;
  }

  if (this.discountType === DiscountType.FIXED) {
    total = total - this.discount;
  }

  this.usageCount += 1;
  if (this.usageCount >= this.usageLimit) {
    this.destroy();
  }

  await this.save();

  return total;
};
