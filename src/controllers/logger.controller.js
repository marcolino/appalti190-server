const winston = require("winston");
//const { createLogger, format, transports } = require("winston");
require("winston-syslog");
//const Mail = require("winston-mail").Mail;
//const AwsCloudWatch = require("winston-aws-cloudwatch");
//const i18n = require("i18next");

const config = require("../config");

const localhost = require("os").hostname;
const colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",
  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

let logger, transports, exceptionHandlers = null;
try {
  transports = [
    new winston.transports.File({
      filename: config.logs.file,
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.align(),
        winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
      ),
      timestamp: true,
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      prettyPrint: true,
      json: true,
      maxsize: 5242880
    }),
  ];

  exceptionHandlers = [
    new winston.transports.File({ filename: config.logs.file })
  ];

  if (process.env.NODE_ENV === "production") { // use syslog transport on papertrail only in production
    exceptionHandlers.push(
      new winston.transports.Syslog({
        host: config.logs.papertrail.host,
        port: config.logs.papertrail.port,
        app_name: config.api.name,
        localhost,
      })
    );
  }

  if (process.env.NODE_ENV !== "production" /*&& process.env.NODE_ENV !== "test"*/) { // if we're not in production nor test then also log to the `Console` transport
    const consoleLogFormat = winston.format.printf(info => {
      return `${info.timestamp} ${info.level}: ` + info.message;
    });
    transports.push(new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), consoleLogFormat),
      level: "debug",
      handleExceptions: true,
      prettyPrint: true,
      colorize: true,
    }));
  }
} catch(err) {
  console.error("Winston transports creation error:", err);
  throw(err);
}

try {
  logger = winston.createLogger({
    transports,
    exceptionHandlers
  });
} catch(err) {
  console.error("Winston logger creation error:", err);
}

//let logger = winston.createLogger();

module.exports = { logger, colors };
