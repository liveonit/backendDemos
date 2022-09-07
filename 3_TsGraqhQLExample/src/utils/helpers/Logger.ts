import chalk from 'chalk';
import { config } from '@src/config';

export const logger = {
  debug: (data: any): void => {
    if (!config.isProduction)
      typeof data === 'object'
        ? console.debug(chalk.hex('ffa500')(`🐛 [Debug]: ${JSON.stringify(data, null, 2)}`))
        : console.debug(chalk.hex('ffa500')(`🐛 [Debug]: ${data?.toString()}`));
  },
  log: (data: any): void => {
    if (!config.isProduction) console.log(data);
  },
  logInfo: (data: any, processName?: string): void => {
    typeof data === 'object'
      ? console.log(chalk.white(`ℹ️  [${processName || 'INFO'}]: ${JSON.stringify(data, null, 2)}`))
      : console.log(chalk.white(`ℹ️  [${processName || 'INFO'}]: ${data?.toString()}`));
  },
  logTitle: (title: string): void => console.log(chalk.blueBright(`👉 ${title}`)),
  logSuccess: (data: any, processName?: string): void => {
    typeof data === 'object'
      ? console.info(
          chalk.greenBright(`✅ [${processName || 'SUCCESS'}]: ${JSON.stringify(data, null, 2)}`),
        )
      : console.info(chalk.greenBright(`✅ [${processName || 'SUCCESS'}]: ${data?.toString()}`));
  },
  logWarning: (data: any, processName?: string): void => {
    typeof data === 'object'
      ? console.warn(
          chalk.yellowBright(`⚠️ [${processName || 'WARNING'}]: ${JSON.stringify(data, null, 2)}`),
        )
      : console.warn(chalk.yellowBright(`⚠️ [${processName}]: ${data?.toString()}`));
  },
  logError: (data: any, processName?: string): void => {
    if (data.stack)
      console.error(chalk.redBright(`❌ [${processName || 'ERROR'}]: ${data.stack?.toString()}`));
    if (typeof data === 'object') console.error(chalk.redBright(JSON.stringify(data, null, 2)));
    else console.error(chalk.redBright(data?.toString()));
  },
};
