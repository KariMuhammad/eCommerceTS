import { Schema } from "mongoose";
import { IBlogCategory, IBlogCategoryMethods, IBlogCategoryModel } from "../types";

const BlogCategorySchema = new Schema<IBlogCategory, IBlogCategoryModel, IBlogCategoryMethods>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    description: {
        type: String,
        required: false,
        trim: true,
    },

    slug: {
        type: String,
        required: true,
        trim: true,
    },

    image: {
        type: String,
        trim: true,
    },

    count: {
        type: Number,
        default: 0
    }
})

export default BlogCategorySchema;