import { Request, Response, NextFunction } from "express";
import config from "../../config";
import ErrorAPI from "./ErrorAPI";

class ErrorHandler {
  private static environment: string = config.env;

  static handle() {
    return (
      incomingErrors: ErrorAPI,
      request: Request,
      response: Response,
      next: NextFunction // eslint-disable-line
    ) => {
      let errors: Partial<ErrorAPI> = incomingErrors;

      if (this.environment === "development") {
        errors = ErrorHandler.handleDev(incomingErrors);
      }

      if (this.environment === "production") {
        errors = ErrorHandler.handleProd(incomingErrors);
      }

      return response.status(errors.statusCode).json({ errors });
    };
  }

  static handleDev(errors: ErrorAPI): Partial<ErrorAPI> {
    // console.log(errors);

    return {
      message: errors.message,
      pack: errors.pack,
      statusCode: errors.statusCode,
      stack: errors.stack,
    };
  }
  static handleProd(errors: ErrorAPI): Partial<ErrorAPI> {
    return {
      pack: errors.pack,
      statusCode: errors.statusCode,
    };
  }

  static unhandledPromiseRejection() {
    process.on("unhandledRejection", (error: Error) => {
      console.error("❌ Unhandled Promise Rejection:", error);
      console.error("Stack trace:", error.stack);
      
      // Don't exit immediately for database connection issues
      if (error.message.includes('buffering timed out') || 
          error.message.includes('MongooseError') ||
          error.message.includes('MongoNetworkError')) {
        console.error("Database connection issue detected. Check your database connection and try again.");
      }
      
      process.exit(1);
    });
  }
  static uncaughtException() {
    process.on("uncaughtException", (error: Error) => {
      console.error("❌ Uncaught Exception: ", error);
      process.exit(1);
    });
  }
}

export default ErrorHandler;
