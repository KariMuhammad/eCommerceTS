import BlogModel from "../../blogs/model";
import BlogCategorySchema from "./schema";

BlogCategorySchema.methods.getBlogs = async function() {
    return await BlogModel.find({ category: this.id });
}