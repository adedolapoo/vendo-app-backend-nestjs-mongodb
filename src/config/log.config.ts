import { format, transports, LoggerOptions } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import config, { LogTransport } from '.';
import { LogstashTransport } from 'winston-logstash-ts-fix';
import Transport from 'winston-transport';

const APP_NAME = 'VendorAppAPiService';

const resolveLogTransport = (): Transport => {
  const configTransport = config().log.logTransport;
  let resolvedTransport: Transport;
  switch (configTransport) {
    case LogTransport.LOGSTASH:
      resolvedTransport = new LogstashTransport({
        application: APP_NAME,
        host: config().log.logstashHost,
        port: config().log.logstashPort,
        protocol: 'tcp',
      });
      break;
    case LogTransport.CONSOLE:
    default:
      resolvedTransport = new transports.Console({
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.ms(),
          nestWinstonModuleUtilities.format.nestLike(APP_NAME, {
            prettyPrint: true,
          }),
        ),
      });
      break;
  }
  return resolvedTransport;
};

const logOptions: LoggerOptions = {
  defaultMeta: {
    app: APP_NAME,
    env: config().env.value || 'dev',
    mode: config().env.mode || 'SERVER',
  },
  transports: [resolveLogTransport()],
  exitOnError: false,
  level: config().log.logLevel,
};

if (!config().env.isTest) {
  logOptions.format = format.combine(
    format.label({ label: APP_NAME }),
    format.timestamp(),
    format.errors({ stack: true }),
    format.metadata({
      key: 'metadata',
      fillExcept: [
        'message',
        'level',
        'timestamp',
        'label',
        'app',
        'env',
        'mode',
      ],
    }),
    // winstonFormats.addContext(),
    format.json(),
  );
}

export { logOptions };
