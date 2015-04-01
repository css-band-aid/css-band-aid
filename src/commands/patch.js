function execute() {
  console.log('patch execute');
  console.log(options);
}

function parseArgs(){
  let options = yargs
    .reset()
    .option('force', {
      alias: 'f',
      demand: false,
      default: false,
      describe: 'modify the input file provided'
    })
    .wrap(null)
    .parse(argv);

  options.input = options.length > 0 ? options._[0] : null;
  options.output = options.length > 1 ? options._[1] : null;

  if (!options.input) {
    throw 'No input provided';
  }

  if (!options.force && !options.output) {
    throw 'No output provided';
  }

  if (!options.force && options.input === options.output) {
    throw 'Use --force of -f to modify the input file';
  }

  return {
    options,
    execute
  };
}

export default {
  parseArgs,
  execute
}
