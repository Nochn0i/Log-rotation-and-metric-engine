import { Router } from "express";
import Joi from "joi";
import fsp from "fs/promises";
import { fllf, render_file } from "./utils.js";
import path from "path";
import { __config, __logdir } from "./config.js";
import { MAX_LOG_LIMIT } from "./config.js";

const router = Router();

// input validator
const input_validator = async (req, res, next) => {
  try {
    const data_validator = Joi.object({
      level: Joi.string().valid("info", "warn", "error").lowercase().required(),
      message: Joi.string().required(),
    });

    const { error, value } = data_validator.validate(req.body, {
      abortEarly: true,
      stripUnknown: true,
    });
    if (error) {
      const err = error.message.split('"');
      next(err[1] + err.splice(2));
    }
    req.body = value;
    next();
  } catch (e) {
    console.error("Error validating input datas. Err:", e.message);
    next(e);
  }
};

// calculate filesize
const calculate_filesize = async (file_path) => {
  try {
    const bytes = await fsp.stat(file_path);
    return parseInt(bytes.size, 10) || 0;
  } catch (e) {
    console.error("Error calculating file size. Err:", e.message);
    throw e;
  }
};

// switch Log file
const switch_log = async (current_filename) => {
  try {
    const new_filename = `app.${parseInt(current_filename.split(".")[1]) + 1}.log`;
    await fsp.writeFile(
      __config,
      JSON.stringify({ current_file: new_filename }),
    );
    return new_filename;
  } catch (e) {
    console.error("Error switching log file. Err:", e.message);
    throw e;
  }
};

// capture route
router.post("/capture", input_validator, async (req, res, next) => {
  const D = {
    ...req.body,
    timestamp: new Date().toISOString(),
  };
  const content = `| ${D.level} | ${D.message} | ${D.timestamp} |\n`;

  try {
    const filename = await fllf();
    let filepath = path.join(__logdir, filename);
    const filesize = await calculate_filesize(filepath);
    if (filesize >= MAX_LOG_LIMIT) {
      filepath = path.join(__logdir, await switch_log(filename));
      await render_file();
    }

    await fsp.appendFile(filepath, content);

    return res.status(200).json({
      message: "Log was writtien successfully.",
    });
  } catch (e) {
    console.error("Error writing log to the file. Err:", e.message);
    next(e);
  }
});

export default router;
