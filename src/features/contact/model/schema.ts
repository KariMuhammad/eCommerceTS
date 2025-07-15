import { Schema } from "mongoose";
import { IContact, IContactMethods, IContactModel } from "../types";

const ContactSchema = new Schema<IContact, IContactModel, IContactMethods>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  comment: { type: String, required: true },
});

export default ContactSchema;
