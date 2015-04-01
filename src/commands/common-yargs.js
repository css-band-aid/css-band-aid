import { version } from '../../package.json';

export default function appendCommon(yargs) {
  yargs.usage(`CSS Band Aid ${version}`.magenta + ` - Tools to ensure CSS files meet IE 6-9 selector limit restrictions.

Usage: $0 count <file|directory>
Usage: $0 patch <input file> [<output file>] [options]`)
  .option('help', {
    alias: 'h',
    demand: false,
    default: false,
    describe: 'Show help'
  })
  .epilogue('For additional information see https://github.com/css-band-aid/css-band-aid')
  .wrap(null);
}
