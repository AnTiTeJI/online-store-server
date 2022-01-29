import cors from "cors";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import swaggerUI from "swagger-ui-express";
import sequelize from "./database";
import ErrorMiddleware from "./middleware/error.middleware";

import { swaggerDocument } from "./router/docs/$swagger";
import router from "./router/$router";

require("dotenv").config();
require("./model/assotiation");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(
  "/api/doc",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, { explorer: true })
);
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({}));
app.use("/api", router);
app.use(ErrorMiddleware);

function start() {
  app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`);
    sequelize.sync({
      logging: false,
    });
  });
}

start();
