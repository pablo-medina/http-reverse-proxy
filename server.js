const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
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
    default: 'default.config.json'
  })
  .option('init', {
    type: 'boolean',
    description: 'Initialize configuration file',
    default: false
  })
  .help()
  .argv;

// If --init is specified, create the configuration file
if (argv.init) {
  const configPath = path.resolve(argv.config);
  if (fs.existsSync(configPath)) {
    logger.warn(`Configuration file already exists at ${configPath}`);
  } else {
    const defaultConfig = {
      port: 3000,
      remoteServer: "http://remote-server:8080"
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    logger.info(`Configuration file created at ${configPath}`);
  }
  process.exit(0);
}

// Check if configuration file exists
const configPath = path.resolve(argv.config);
if (!fs.existsSync(configPath)) {
  logger.error(`Configuration file not found at ${configPath}. Run with --init to create it.`);
  process.exit(1);
}

// Load configuration
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const PORT = config.port;
const REMOTE_SERVER = config.remoteServer;

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
