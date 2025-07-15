import Repository from "../../../common/Repository";

import ColorModel from "../model";
import { IColorDocument } from "../types";

export default class ColorRepository extends Repository<IColorDocument> {
  constructor() {
    super(ColorModel);
  }
}
