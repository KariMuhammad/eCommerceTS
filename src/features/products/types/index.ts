import { Model, Document, Schema } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: {
    percentage: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  }

  discountedPrice?: number;
  savingsAmount?: number;
  category: [Schema.Types.ObjectId];
  brand: Schema.Types.ObjectId;
  images: { url: string; public_id: string }[];
  colors: [
    {
      name: string;
      hexCode: string;
      quantity?: number;
    }
  ];

  quantity: number;
  sold: number;

  // ratings: [
  //   {
  //     stars: number;
  //     review: string;
  //     user: Schema.Types.ObjectId;
  //   }
  // ];

  averageRatings: number;
  reviewsCount: number;

  tags: [string];
}

export interface IProductMethods {
  // updateAverageRatings: () => Promise<void>;
  destroyImages: () => Promise<void>;
}

export interface IProductDocument extends IProduct, Document, IProductMethods { }

export interface IProductModel extends Model<IProductDocument> {
  findBySlug(slug: string): Promise<IProductDocument | null>;
}
