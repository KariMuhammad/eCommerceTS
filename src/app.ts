import express, { Application } from "express";
import cookiesParser from "cookie-parser";
import morgran from "morgan";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import config from "../config";
import connectDatabase from "../database";

// Features
import apps from "./features";

class App {
  private static app: Application;
  private static instance: App;

  private constructor() {
    App.app = express();
  }

  private setupDatabase() {
    connectDatabase().catch(error => {
      console.error(error.message);
      process.exit(1);
    });
  }

  private setupStandardMiddlewares() {
    App.app.use(express.json());
    App.app.use(express.urlencoded({ extended: true }));
    App.app.use("/static", express.static(`${config.static}`));
    App.app.use(cookiesParser());
    App.app.use(morgran("dev"));
    App.app.use(
      // to enable frontend to access backend
      cors({
        origin: config.cors.origin || "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      })
    );
  }
  private setupRoutesMiddlewares() {
    App.app.use("/", apps);
  }

  public static start() {
    App.self().setupDatabase();
    App.self().setupStandardMiddlewares();
    App.self().setupRoutesMiddlewares();

    return App.app;
  }

  private static self() {
    if (!App.instance) App.instance = new App();
    return App.instance;
  }
}

export default App;
