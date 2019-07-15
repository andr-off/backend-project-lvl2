import commander from 'commander';

const program = new commander.Command();

export default () => {
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .arguments('<firstConfig> <secondConfig>');

  program.parse(process.argv);
};
