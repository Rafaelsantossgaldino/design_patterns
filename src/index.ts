import express from "express";
import { PostgresDataSource } from "./data-source";
import routes from "./routes/index";

PostgresDataSource.initialize().then(() => {
  const app = express();

  app.use(express.json());


  app.use(routes)

  return app.listen(process.env.PORT)
})
