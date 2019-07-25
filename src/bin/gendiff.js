#!/usr/bin/env node

import commander from 'commander';
import genDiff from '..';

const program = new commander.Command();

const main = () => {
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format', 'standart')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      const diff = genDiff(firstConfig, secondConfig, program.format);

      console.log(diff);
    });

  program.parse(process.argv);
};

main();
