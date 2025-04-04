# HTTP Reverse Proxy

A simple HTTP reverse proxy server built with Node.js and Express.

## Requirements

- Node.js (version 14 or higher)
- npm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd http-reverse-proxy
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The server uses a JSON configuration file. To create the default configuration file, run:

```bash
npm run config:init
```

This will create a `default.config.json` file with the following structure:

```json
{
  "port": 3000,
  "remoteServer": "http://remote-server:8080"
}
```

You can modify these values according to your needs:
- `port`: Port where the proxy server will listen
- `remoteServer`: URL of the remote server to which requests will be forwarded

If you want to create a configuration file with a different name, you can specify it with:

```bash
npm run config:init -- my-config
```

This will create a file named `my-config.config.json`.

## Usage

To start the proxy server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will forward all requests to the remote server specified in the configuration.

## Command Line Options

### Server Options
- `--config` or `-c`: Specifies the path to the configuration file (default: default.config.json)
- `--help`: Shows help information

### Configuration Initialization
- `[configName]`: Optional name of the configuration file (without .config.json extension)
- `--help`: Shows help information

## Logs

The server logs all requests and responses to the console using Morgan's combined format.

## Notes

- Configuration files (`.config.json`) are excluded from version control for security
- Make sure the remote server is accessible before starting the proxy 