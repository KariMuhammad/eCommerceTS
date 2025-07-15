import { Schema } from "mongoose";
import { IColorInterface, IColorMethods, IColorModel } from "../types";

const ColorSchema = new Schema<IColorInterface, IColorModel, IColorMethods>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  code: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  status: {
    type: Boolean,
    default: true,
  },
});

export default ColorSchema;
