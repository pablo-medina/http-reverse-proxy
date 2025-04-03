const winston = require('winston');
const path = require('path');

// Define el formato personalizado para los logs
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Crea el logger
const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    defaultMeta: { service: 'http-reverse-proxy' },
    transports: [
        // Escribe todos los logs en la consola
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Escribe todos los logs con nivel 'error' y menor en 'error.log'
        new winston.transports.File({ 
            filename: path.join('logs', 'error.log'), 
            level: 'error' 
        }),
        // Escribe todos los logs en 'combined.log'
        new winston.transports.File({ 
            filename: path.join('logs', 'combined.log') 
        })
    ]
});

// Si no estamos en producción, también log a la consola con el formato:
// `${timestamp} ${level}: ${message}`
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger; 