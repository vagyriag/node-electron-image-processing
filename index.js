const fs = require('fs');
const Jimp = require('jimp');
const commandLineArgs = require('command-line-args');
const rimraf = require('rimraf');

const optionDefinitions = [
 { name: 'origin', alias: 'o', type: String },
 { name: 'destination', alias: 'd', type: String, defaultValue: 'result' }
];
const options = commandLineArgs(optionDefinitions);
const { origin, destination } = options;

if(!origin) return console.log('--origin parameter is mandatory');

rimraf.sync(destination);

fs.readdir(origin, (err, files) => {
  if(err) return console.error(err);
  
  let count = 0;
  files = files.filter(f => /\.(jpg|png)$/i.test(f));
  files.forEach((file, i) => {
      Jimp.read(`${origin}\\${file}`)
        .then(img => {
          img.resize(800, Jimp.AUTO)
            .quality(60)
            .write(`${destination}/${i + 1}.jpg`);
          img.cover(220, 130)
            .quality(60)
            .write(`${destination}/thumb_${i + 1}.jpg`);
          
          // feedback
          console.log(`${++count} of ${files.length}...`);
          if(count == files.length) console.log('done!');
        })
        .catch(console.error);
    });
})