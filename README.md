# HTTP Reverse Proxy

A simple HTTP reverse proxy server built with Node.js, Express, and http-proxy-middleware.

## Features

- Configurable through JSON files
- Supports WebSocket connections
- Customizable port and target server
- Simple command-line interface
- Structured logging with Winston
- Error handling and monitoring

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/http-reverse-proxy.git
cd http-reverse-proxy
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Basic Usage

Start the proxy server with default configuration:

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Custom Configuration

Specify a custom configuration file:

```bash
npm start -- --config path/to/config.json
```

Or using the short alias:
```bash
npm start -- -c path/to/config.json
```

### Configuration File Format

The configuration file should be a JSON file with the following structure:

```json
{
  "port": 3000,
  "remoteServer": "http://target-server:port"
}
```

- `port`: The local port where the proxy will listen
- `remoteServer`: The target server URL to which requests will be forwarded

### Example Configuration Files

1. Default configuration (`config/default.json`):
```json
{
  "port": 3000,
  "remoteServer": "http://remote-server:8080"
}
```

2. Production configuration (`config/production.json`):
```json
{
  "port": 8080,
  "remoteServer": "http://production-server:80"
}
```

## Logging

The application uses Winston for structured logging. Logs are stored in the `logs` directory:

- `logs/combined.log`: Contains all logs
- `logs/error.log`: Contains only error logs

Log format:
```json
{
  "timestamp": "2024-04-03T12:34:56.789Z",
  "level": "info",
  "service": "http-reverse-proxy",
  "message": "Proxy server started",
  "configFile": "config/default.json",
  "port": 3000,
  "target": "http://remote-server:8080"
}
```

## Error Handling

- If the specified configuration file doesn't exist, the server will exit with an error message
- The server will show which configuration file is being used when starting up
- All errors are logged to both console and log files

## Dependencies

- express: Web framework
- http-proxy-middleware: Proxy middleware
- config: Configuration management
- yargs: Command line argument parsing
- morgan: HTTP request logging
- winston: Logging
- nodemon: Development auto-reload (dev dependency)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC 