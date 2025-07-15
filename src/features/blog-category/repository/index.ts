import Repository from "../../../common/Repository";
import BlogCategoryModel from "../model";
import { IBlogCategoryDocument } from "../types";

export default class BlogCategoryRepository extends Repository<IBlogCategoryDocument> {
    constructor() {
        super(BlogCategoryModel)
    }
}