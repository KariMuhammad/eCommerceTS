import { Document, Model, Schema } from "mongoose";
import { IBlogCategoryDocument } from "../../blog-category/types";

export interface IBlog {
  title: string;
  description: string;
  image: string;
  author: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  views: number;
  likes: Schema.Types.ObjectId[];
  dislikes: Schema.Types.ObjectId[];
}
export interface IBlogMethods {
  isUserLike(user: Schema.Types.ObjectId): boolean;
  isUserDislike(user: Schema.Types.ObjectId): boolean;
  getCategory(): IBlogCategoryDocument;
}
export interface IBlogDocument extends IBlog, Document, IBlogMethods {}

export interface IBlogModel extends Model<IBlogDocument> {
  getMostViewBlogs(): Promise<IBlog[]>;
}
