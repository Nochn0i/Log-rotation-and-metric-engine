import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { __config, __dirname, __lfp, __logdir } from "./config.js";

// get all log files. [galf]
export const galf = async () => {
  try {
    const f = await fsp.readdir(__logdir);
    const matching_files = f.filter((file) => __lfp.test(file));
    return matching_files;
  } catch (e) {
    console.error("Failed to read directory. Err:", e.message);
    throw e;
  }
};

// create log directory if doesn't exist [cldd]
export const cldd = async () => {
  try {
    if (!fs.existsSync(__logdir)) fs.mkdirSync(__logdir);
  } catch (e) {
    console.error("Error creating directory. Err:", e.message);
    throw e;
  }
};

// create config file if doesn't exist. [cc]
export const cc = async (current_file) => {
  try {
    if (!fs.existsSync(__config))
      await fsp.writeFile(
        __config,
        JSON.stringify({
          current_file,
        }),
      );
  } catch (e) {
    console.error("Error creating directory. Err:", e.message);
    throw e;
  }
};

// fetch latest log file [fllf]
export const fllf = async () => {
  const farr = await galf();
  if (farr.length === 0) return "app.1.log";
  const numbers = farr.map((file) => parseInt(file.split(".")[1], 10));
  const highestNum = Math.max(...numbers);
  return `app.${highestNum}.log`;
};

// create log file if doesn't exist.
export const clf = async (file_name) => {
  try {
    const file_path = path.join(__logdir, file_name);
    if (!fs.existsSync(file_path)) await fsp.writeFile(file_path, "");
  } catch (e) {
    console.error("Error creating log file. Err:", e.message);
    throw e;
  }
};

// render file
export const render_file = async () => {
  try {
    await cldd();
    const latest_file = await fllf();
    await cc(latest_file);
    await clf(latest_file);
  } catch (e) {
    console.error("Error rendering file. Err:", e.message);
    throw e;
  }
};
