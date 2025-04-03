const fs = require('fs');
const path = require('path');
const readline = require('readline');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const logger = require('./logger');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const argv = yargs(hideBin(process.argv))
  .command('$0 [configName]', 'Initialize a configuration file', (yargs) => {
    return yargs.positional('configName', {
      describe: 'Name of the configuration file (without .config.json extension)',
      type: 'string',
      default: 'default'
    });
  })
  .help()
  .argv;

const configFileName = `${argv.configName}.config.json`;
const configPath = path.resolve(configFileName);

const createConfigFile = async () => {
  const defaultConfig = {
    port: 3000,
    remoteServer: "http://remote-server:8080"
  };

  try {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    logger.info(`Configuration file created at ${configPath}`);
  } catch (error) {
    logger.error(`Failed to create configuration file: ${error.message}`);
    process.exit(1);
  }
};

const main = async () => {
  if (fs.existsSync(configPath)) {
    const answer = await askQuestion(`Configuration file ${configPath} already exists. Do you want to replace it? (y/N) `);
    if (answer.toLowerCase() === 'y') {
      await createConfigFile();
    } else {
      logger.info('Operation cancelled');
    }
  } else {
    await createConfigFile();
  }
  rl.close();
};

main(); 