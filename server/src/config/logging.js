import winston from 'winston'
import path from 'path'
require('winston-mongodb')
require('express-async-errors')

process.on('unhandledRejection', ex => {
  throw ex
})
console.log(path.join(__dirname, '../logs/uncaughtExceptions.log'))

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/logfile.log')
    }),
    new winston.transports.MongoDB({
      db: process.env.DB_URL_LOG,
      level: 'info'
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/uncaughtExceptions.log')
    })
  ]
})
