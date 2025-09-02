import { Request } from "express";
import Repository from "../../../common/Repository";
import ProductModel from "../model";
import { IProductDocument } from "../types";
import { FilterQuery } from "mongoose";
import QueryFeatures from "../../../common/QueryFeatures";
import { catchAsync } from "../../../common/helpers";

class ProductRepository extends Repository<IProductDocument> {
  constructor() {
    super(ProductModel);
  }


  /**
   * Return Data with Pagination format
   * @param selector 
   * @param request 
   * @returns 
   */
  async readWithQueryFeatures(
    selector: FilterQuery<IProductDocument>,
    request: Request
  ) {
    console.log("Request Query", request.query);

    const query = super.read(selector);
    const enhanceQuery = await new QueryFeatures<IProductDocument>(
      query,
      request.query
    )
      .all()
      .search(["name"]) // Search by name only
      .paginate();

    const mongooseQueryResult = await enhanceQuery.mongooseQuery;

    return {
      data: mongooseQueryResult,
      query: enhanceQuery.mongooseQuery,
      pagination: enhanceQuery.pagination,
    };
  }

  async readBySlug(slug: string) {
    const product = await (super.readOne({ slug }).populate("category", "name slug"));
    return { product };
  }
}

export default ProductRepository;
