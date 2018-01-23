const fs = require('fs'),
      sharp = require('sharp'),
      commandLineArgs = require('command-line-args'),
      rimraf = require('rimraf'),
      mkdirp = require('mkdirp');

const optionDefinitions = [
  { name: 'origin',        alias: 'o', type: String                          },
  { name: 'destination',   alias: 'd', type: String, defaultValue: 'result'  },
  { name: 'thumb',         alias: 't', type: Boolean, defaultValue: false    },
  { name: 'rename',        alias: 'r', type: Boolean, defaultValue: false    },
  { name: 'ignoreSmaller', alias: 'i', type: Boolean, defaultValue: false    },
  { name: 'width',         alias: 'W', type: Number, defaultValue: 800       },
  { name: 'height',        alias: 'H', type: Number, defaultValue: undefined },
  { name: 'thumbWidth',    alias: 'w', type: Number, defaultValue: 220       },
  { name: 'thumbHeight',   alias: 'h', type: Number, defaultValue: 150       },
];
const options = commandLineArgs(optionDefinitions);
const { origin, destination, thumb, rename, ignoreSmaller, width, height, thumbWidth, thumbHeight } = options;

if(!origin) return console.log('--origin parameter is mandatory');

rimraf.sync(destination);

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = function(dir, filelist) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    }
    else {
      filelist.push(dir + file);
    }
  });
  return filelist;
};

var list = walkSync(origin).filter(f => /\.(jpg|png|tif)$/i.test(f)),
    count = 0, lastFolder, lastIndex;

console.log(`Total: ${list.length}`);

list.forEach((orig, i) => {
  var dist = orig.replace(/^(\.{2}\/)?.*?\//, '').replace(/\..*$/, ''),
      name = dist.match(/(?!\/)[^\/]*$/)[0],
      folder = `${destination}/${dist.substring(0, dist.length - name.length)}`;

  // create full path
  mkdirp.sync(folder);

  if(lastFolder != folder) (lastFolder = folder) && (lastIndex = i);
  if(rename) name = i + 1 - lastIndex;

  var img = sharp(orig);

  img.metadata().then((meta) => {
    if(ignoreSmaller && meta.width <= width) return console.log(`progress: ${++count} of ${list.length} - ignored`);

    img.resize(width, height)
      .withoutEnlargement()
      .crop(sharp.strategy.entropy)
      .jpeg({ progressive: true });
    
    img.clone().toFile(`${folder}/${name}.jpg`, (err) =>
      console.log(`progress: ${++count} of ${list.length}`));

    if(!thumb) return;
    img.resize(thumbWidth, thumbHeight)
      .crop(sharp.strategy.entropy)
      .jpeg({ quality:60, progressive: true });
    
    img.toFile(`${folder}/${name}_thumb.jpg`);

  });
});