import { model } from "mongoose";
import ColorSchema from "./schema";
import { IColorDocument } from "../types";

import "./methods";

const ColorModel = model<IColorDocument>("Color", ColorSchema);

export default ColorModel;
