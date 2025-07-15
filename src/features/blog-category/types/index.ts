import { Document, Model } from "mongoose";
import { IBlogDocument } from "../../blogs/types";
import { ICategory, ICategoryMethods } from "../../category/types";

export interface IBlogCategory {
    name: string;
    slug: string;
    description: string;
    image: string;
    count: number;
}

export interface IBlogCategoryMethods {
    getBlogs: () => Promise<IBlogDocument[]>;
}

export interface IBlogCategoryDocument extends ICategory, ICategoryMethods, Document {}

export interface IBlogCategoryModel extends Model<IBlogCategoryDocument | null> {
 destroyAllBlogs: (blogCategoryId) => void;
}