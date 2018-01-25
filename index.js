const commandLineArgs = require('command-line-args'),
      imageProcessing = require('./imageProcessing');

const optionDefinitions = [
  { name: 'origin',           alias: 'o', type: String  },
  { name: 'destination',      alias: 'd', type: String  },
  { name: 'thumb',            alias: 't', type: Boolean },
  { name: 'rename',           alias: 'r', type: Boolean },
  { name: 'ignoreSmaller',    alias: 'i', type: Boolean },
  { name: 'cleanDestination', alias: 'c', type: Boolean },
  { name: 'buffer',           alias: 'b', type: Boolean },
  { name: 'width',            alias: 'W', type: Number  },
  { name: 'height',           alias: 'H', type: Number  },
  { name: 'thumbWidth',       alias: 'w', type: Number  },
  { name: 'thumbHeight',      alias: 'h', type: Number  },
];
const options = commandLineArgs(optionDefinitions);

imageProcessing(options);