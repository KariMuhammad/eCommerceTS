import { FieldValidationError, validationResult } from "express-validator";
import ErrorAPI, { ErrorType } from "./ErrorAPI";

class Validations {
  protected throwMethod = ErrorAPI.badRequest;

  protected validate() {
    return (req, res, next) => {
      const _errors = validationResult(req);
      console.log(_errors);

      if (!_errors.isEmpty()) {
        const errors = _errors.array().map((error: FieldValidationError) => ({
          // field: error.type,
          message: error.msg,
          field: error.path,
        }));

        console.log(errors);
        // return next(this.throwMethod("Validation Error", errors));
        return next(this.throwMethod("Validation Error", errors));
      }

      next();
    };
  }

  public static getInstance() {
    return new this();
  }
}

export default Validations;
