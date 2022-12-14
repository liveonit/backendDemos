import chalk from 'chalk';
import { config } from '@src/config';

export const logger = {
  debug: (data: any): void => {
    if (!config.isProduction)
      typeof data === 'object'
        ? console.debug(chalk.hex('ffa500')(`đ [Debug]: ${JSON.stringify(data, null, 2)}`))
        : console.debug(chalk.hex('ffa500')(`đ [Debug]: ${data?.toString()}`));
  },
  log: (data: any): void => {
    if (!config.isProduction) console.log(data);
  },
  info: (data: any, processName?: string): void => {
    typeof data === 'object'
      ? console.log(chalk.white(`âšī¸  [${processName || 'INFO'}]: ${JSON.stringify(data, null, 2)}`))
      : console.log(chalk.white(`âšī¸  [${processName || 'INFO'}]: ${data?.toString()}`));
  },
  title: (title: string): void => console.log(chalk.blueBright(`đ ${title}`)),
  success: (data: any, processName?: string): void => {
    typeof data === 'object'
      ? console.info(
          chalk.greenBright(`â [${processName || 'SUCCESS'}]: ${JSON.stringify(data, null, 2)}`),
        )
      : console.info(chalk.greenBright(`â [${processName || 'SUCCESS'}]: ${data?.toString()}`));
  },
  warning: (data: any, processName?: string): void => {
    typeof data === 'object'
      ? console.warn(
          chalk.yellowBright(`â ī¸ [${processName || 'WARNING'}]: ${JSON.stringify(data, null, 2)}`),
        )
      : console.warn(chalk.yellowBright(`â ī¸ [${processName}]: ${data?.toString()}`));
  },
  error: (data: any, processName?: string): void => {
    if (data.stack)
      console.error(chalk.redBright(`â [${processName || 'ERROR'}]: ${data.stack?.toString()}`));
    if (typeof data === 'object') console.error(chalk.redBright(JSON.stringify(data, null, 2)));
    else console.error(chalk.redBright(data?.toString()));
  },
};
