import morgan from "morgan";
import { logger } from "@utils/Logger";
import { config } from "@src/config";

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

const skip = () => {
  return config.ENVIRONMENT !== "production";
};

export const loggerMiddleware = morgan("combined", { stream, skip });
