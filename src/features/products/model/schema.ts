import mongoose, { Schema } from "mongoose";
import { IProduct, IProductMethods, IProductModel } from "../types";

const ProductSchema = new Schema<IProduct, IProductModel, IProductMethods>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  discount: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },

  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],

  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },

  images: [{
    url: String,
    public_id: String
  }],

  colors: [
    {
      name: { type: String, required: true },
      hexCode: { type: String, required: true },
      quantity: { type: Number, default: 0 },
    },
  ],

  quantity: {
    type: Number,
    default: 1,
  },

  sold: {
    type: Number,
    default: 0,
  },

  // ratings: [{ type: mongoose.Types.ObjectId }],

  averageRatings: {
    type: Number,
    default: 0,
  },

  reviewsCount: {
    type: Number,
    default: 0,
  },

  tags: [
    {
      type: String,
    },
  ],
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual field to calculate discounted price (if using simple discount percentage)
ProductSchema.virtual('discountedPrice').get(function () {
  if (this.discount.percentage > 0) {
    return this.price - (this.price * this.discount.percentage / 100);
  }
  return this.price;
});

// Virtual field to calculate savings amount
ProductSchema.virtual('savingsAmount').get(function () {
  if (this.discount.percentage > 0) {
    return this.price * this.discount.percentage / 100;
  }
  return 0;
});

ProductSchema.virtual("availability").get(function () {
  return this.quantity > 0;
})
export default ProductSchema;
