import { Schema } from "mongoose";
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

  ratings: [
    {
      stars: {
        type: Number,
        required: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      review: String,
    },
  ],

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
});

export default ProductSchema;
