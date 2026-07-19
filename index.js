import express from "express";
import cors from "cors";
import helmet from "helmet";
import { cldd, galf, fllf, cc, clf } from "./utils.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());
app.use(helmet());

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
    await cldd();
    const latest_file = await fllf();
    await cc(latest_file);
    await clf(latest_file);
    finalize_app();

    app.listen(port, () => console.log(`Server listening on port:4000.`));
  } catch (e) {
    console.log(e.message || "Internal Server Error");
    process.exit(1);
  }
}

start_app();
