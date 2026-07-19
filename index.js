import express from "express";
import cors from "cors";
import helmet from "helmet";
import { render_file } from "./utils.js";
import router from "./route.js";
import { port } from "./config.js";
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use("/api", router);

// finalize app
const finalize_app = () => {
  // health route
  app.get("/health", async (_req, res) =>
    res.status(200).json({
      message: "Welcoem to express server.",
      health: "healthy",
      uptime: process.uptime(),
    }),
  );
  // error handler
  app.use((err, _req, res, _next) => {
    console.error("Error:", err.message);
    return res.status(200).json({
      message: err.message || "Internal Server Error",
      orginal_error: err,
    });
  });
};

// start server
async function start_app() {
  try {
    await render_file();
    finalize_app();

    app.listen(port, () => console.log(`Server listening on port:4000.`));
  } catch (e) {
    console.log(e.message || "Internal Server Error");
    process.exit(1);
  }
}

start_app();
