import { model } from "mongoose";
import ContactSchema from "./schema";
import { IContactDocument } from "../types";

const ContactModel = model<IContactDocument>("Contact", ContactSchema);

export default ContactModel;
