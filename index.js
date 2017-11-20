const fs = require('fs'),
      sharp = require('sharp'),
      commandLineArgs = require('command-line-args'),
      rimraf = require('rimraf'),
      mkdirp = require('mkdirp');

const optionDefinitions = [
 { name: 'origin', alias: 'o', type: String },
 { name: 'destination', alias: 'd', type: String, defaultValue: 'result' }
];
const options = commandLineArgs(optionDefinitions);
const { origin, destination } = options;

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

var list = walkSync(origin)
  .filter(f => /\.(jpg|png|tif)$/i.test(f));

//console.log(list);

list.forEach((orig, i) => {
  //console.log(file);

  var dist = orig.replace(/^(\.{2}\/)?.*?\//, '')
            .replace(/\..*$/, ''),
      name = dist.match(/(?!\/)[^\/]*$/)[0],
      folder = destination + '/' + dist.substring(0, dist.length - name.length);

      console.log(folder);
      console.log(name);
      console.log('');

  mkdirp(folder);
return;
  var big = sharp(orig)
    .resize(800)
    .jpeg({ progressive: true });
  var small = big.clone()
    .resize(220, 130)
    .jpeg({ quality:60, progressive: true });
  
  big.toFile(`${destination}/${i + 1}.jpg`);
  small.toFile(`${destination}/thumb_${i + 1}.jpg`);

});











return;

fs.readdir(origin, (err, files) => {
  if(err) return console.error(err);
  
  let count = 0;
  console.log(files)
  files = files.filter(f => /\.(jpg|png|tif)$/i.test(f));
  files.forEach((file, i) => {
    console.log(file);
    var big = sharp(`${origin}\\${file}`)
      .resize(800)
      .jpeg({ progressive: true });
    var small = big.clone()
      .resize(220, 130)
      .jpeg({ quality:60, progressive: true });
    
    big.toFile(`${destination}/${i + 1}.jpg`);
    small.toFile(`${destination}/thumb_${i + 1}.jpg`);

      /*Jimp.read(`${origin}\\${file}`)
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
        .catch(console.error);*/
    });
})