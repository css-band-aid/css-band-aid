import yargs from 'yargs';

function execute(options) {
  console.log('count execute');
  console.log(options);
}

function parseArgs(argv){
  console.log('count setup');
}

export default {
  parseArgs,
  execute
}
