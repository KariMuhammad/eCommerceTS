import { Document, Model } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  comment: string;
}

export interface IContactMethods {
  delete: () => Promise<IContact>;
}

export interface IContactDocument extends IContact, IContactMethods {}

export interface IContactModel extends Model<IContactDocument> {
  // static methods
  getByEmail: (email: string) => IContact;
}
