import { model } from "mongoose";
import BlogCategorySchema from "./schema";
import { IBlogCategoryDocument } from "../types";

import "./methods";
import "./hooks";

const BlogCategoryModel = model<IBlogCategoryDocument>("Blog_Category", BlogCategorySchema);

export default BlogCategoryModel;