import { Document, Model, Types } from "mongoose";

export interface IColorInterface {
  name: string;
  code: string;
  status: boolean;
  createdBy: Types.ObjectId;
}
export interface IColorMethods {
  delete: () => void;
  update: (data: Partial<IColorInterface>) => void;
  toJSON: () => IColorInterface;
  isAvailable: () => boolean;
}

export interface IColorDocument
  extends IColorInterface,
    IColorMethods,
    Document {}

export interface IColorModel extends Model<IColorDocument> {
  findByCode: (code: string) => Promise<IColorDocument | null>;
}
