const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export default (serviceName: string) => createLogger({
  format: combine(
    label({ label: serviceName }),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()]
});
