import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import routes from "./src/routes/index.js";
import logger from "./src/middleware/logger.js";

import siteData from "./src/middleware/siteData.js";
import baseData from "./src/middleware/baseData.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(logger);
app.use(siteData);
app.use(baseData);


// routes
app.use("/", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("pages/404", {
    title: "404"
  });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).render("pages/500", {
    title: "Server Error"
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
