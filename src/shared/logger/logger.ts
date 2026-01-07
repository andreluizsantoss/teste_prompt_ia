import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { env } from '@shared/env'

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
)

const transports: winston.transport[] = [
  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
  }),
]

if (env.ILPI_CONCIERGE_NODE_ENV === 'dev') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`
        }),
      ),
    }),
  )
}

export const logger = winston.createLogger({
  level: env.ILPI_CONCIERGE_NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports,
})
