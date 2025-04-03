const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('config');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const logger = require('./logger');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('config', {
    alias: 'c',
    type: 'string',
    description: 'Path to configuration file',
    default: 'config/default.json'
  })
  .help()
  .argv;

// Verify if config file exists
const configPath = path.resolve(argv.config);
if (!fs.existsSync(configPath)) {
    logger.error(`Configuration file not found at ${configPath}`);
    process.exit(1);
}

// Set the config directory based on the provided config file
process.env.NODE_CONFIG_DIR = path.dirname(argv.config);

const PORT = config.get('port');
const REMOTE_SERVER = config.get('remoteServer');

const app = express();

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Custom logging for proxy responses
const proxy = createProxyMiddleware({
    target: REMOTE_SERVER,
    changeOrigin: true,
    secure: false,
    ws: true,
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Host', 'localhost');
    },
    onProxyRes: (proxyRes, req, res) => {
        logger.info('Proxy Response', {
            status: proxyRes.statusCode,
            method: req.method,
            url: req.url,
            target: REMOTE_SERVER
        });
    },
    onError: (err, req, res) => {
        logger.error('Proxy Error', {
            error: err.message,
            method: req.method,
            url: req.url,
            target: REMOTE_SERVER
        });
        res.status(500).send('Proxy Error');
    }
});

app.use('/', proxy);

app.listen(PORT, () => {
    logger.info('Proxy server started', {
        configFile: argv.config,
        port: PORT,
        target: REMOTE_SERVER
    });
});
