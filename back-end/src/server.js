import express from "express";
const cors = require("cors");
import { routes } from "./routes";
import { initializeDbConnection } from "./db";
const dotEnv = require("dotenv");

const PORT = process.env.PORT || 8080;
dotEnv.config();

const app = express();

// This allows us to access the body of POST/PUT
// requests in our route handlers (as req.body)
app.use(cors());
app.use(express.json());

// exported from routes/index.js
routes.forEach((route) => {
  app[route.method](route.path, route.handler);
});

// Connect to the database, then start the server.
// This prevents us from having to create a new DB
// connection for every request.
initializeDbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
