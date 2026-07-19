import path from "path";
import { fileURLToPath } from "url";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const __config = path.join(__dirname, "config.json");
export const __lfp = /^app\.\d+\.log$/; // log file pattern [lfp]
export const __logdir = path.join(__dirname, "logs");
export const MAX_LOG_LIMIT = 51200;
export const port = 4000;
