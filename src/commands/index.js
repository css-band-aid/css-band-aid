import count from './count';
import patch from './patch';
import help from './help';
import common from './common-yargs';

export default {
  executable: {
    count,
    patch
  },
  common,
  help
}
