const winston = require("winston");
const { createLogger, format, transports } = require("winston");
require("winston-syslog");
//const Mail = require("winston-mail").Mail;
//const AwsCloudWatch = require("winston-aws-cloudwatch");
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

let logger = null;
try {
  logger = createLogger({
    transports: [
      new transports.File({
        filename: config.logsFile,
        format: format.combine(
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          format.align(),
          format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        ),
        timestamp: true,
        colorize: true,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        prettyPrint: true,
        json: true,
        maxsize: 5242880
      }),
    ],

    exceptionHandlers: [
      new /*winston.*/transports.File({ filename: config.logsFile, })
    ],
  });
logger.debug("LOGGER:", logger, logger?.exceptionHandlers);

  if (process.env.NODE_ENV === "NOproduction") { // log exceptions to Mail only in production
    // TODO: use syslog transport on papertrail only in production !!!
    logger.exceptionHandlers.add(
      new transports.Syslog({
        host: "logs6.papertrailapp.com",
        port: 18466,
        app_name: config.api.name,
        localhost,
      })
    );
    
    // TODO ....................
    // logger.exceptionHandlers.add(
    //   new Mail({
    //     to: ["marcosolari@gmail.com"],
    //     from: "appalti190mailer" + " " + "<marcosolari@gmail.com>",
    //     subject: "Appalti190 {{level}}",
    //     host: "smtp.gmail.com",
    //     username: "marcosolari@gmail.com",
    //     password: "dpevuufaijfhhqyu",
    //     ssl: true,
    //     prettyPrint: true,
    //   }),
    // );

    // if we're in production then also log to the `Mail` transport
    /*
     * avoid logging to email...
     *
     * logger.add(new winston.transports.Mail(config.email));
     */

    // logger.add(new AwsCloudWatch({
    //   logGroupName: process.env.NODE_ENV, // log group name: production / development / ...
    //   logStreamName: "marco", // log stream name: logged user name
    //   createLogGroup: true,
    //   createLogStream: true,
    //   awsConfig: {
    //     region: process.env.AWS_REGION,
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //   },
    // }));
  }

  if (process.env.NODE_ENV !== "production") {
    // if we're not in production then also log to the `Console` transport
    const consoleLogFormat = winston.format.printf(info => {
      return `${info.timestamp} ${info.level}: ` + info.message;
    });
    logger.add(new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), consoleLogFormat),
      level: 'debug',
      handleExceptions: true,
      prettyPrint: true,
      colorize: true,
    }));
  }
} catch(err) {
  console.error("Winston logger creation error:", err);
}

// loggerAddAwsCloudWatch = (logGroupName = process.env.NODE_ENV, logStreamName = "_DEFAULT_") => {
//   logger.add(new AwsCloudWatch({
//     logGroupName,
//     logStreamName,
//     createLogGroup: true,
//     createLogStream: true,
//     awsConfig: {
//       region: process.env.AWS_REGION,
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//   }));
// }
//
// module.exports = {logger, loggerAddAwsCloudWatch};

module.exports = {logger, colors};
