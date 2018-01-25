const fs = require('fs'),
      sharp = require('sharp'),
      rimraf = require('rimraf'),
      mkdirp = require('mkdirp');

function imageProcessing ({ 
      origin, destination = 'result',
      thumb, rename, ignoreSmaller, cleanDestination, buffer,
      width = 800, height = undefined, thumbWidth = 220, thumbHeight = 150 
    }: {
      origin: string, destination?: string,
      thumb?: boolean, rename?: boolean, ignoreSmaller?: boolean, cleanDestination?: boolean, buffer?: boolean,
      width?: number, height?: number, thumbWidth?: number, thumbHeight?: number,
    }) {

  // mandatory origin
  if(!origin) return console.log('--origin parameter is mandatory');

  if(origin.charAt(origin.length - 1) !== '/') origin += '/';


  // no cache with buffer (overwrite)
  if(buffer) sharp.cache(false);

  // clean destination folder (DANGER)
  if(cleanDestination) console.log('cleaning destination...'), rimraf.sync(destination);

  // files array
  var list = walkSync(origin).filter(f => /\.(jpg|png|tif)$/i.test(f)),
      count = 0, lastFolder, lastIndex;

  console.log(`Total: ${list.length}`);

  list.forEach((orig, i) => {
    // relative folder and name without extension
    var dist = orig.replace(/^(\.{2}\/)?.*?\//, '').replace(/\..*$/, ''),
        // original file name
        name = dist.match(/(?!\/)[^\/]*$/)[0],
        // relative folder to destination
        folder = `${destination}/${dist.substring(0, dist.length - name.length)}`;

    // create full path
    mkdirp.sync(folder);

    // lastIndex by folder
    if(lastFolder != folder) (lastFolder = folder) && (lastIndex = i);
    // rename by index
    if(rename) name = i + 1 - lastIndex;

    // load original image
    var img = sharp(orig);

    img.metadata().then((meta) => {
      const feedback = `progress: ${++count} of ${list.length}`,
        filename = `${folder}/${name}.jpg`,
        thumbname = `${folder}/${name}_thumb.jpg`;
      if(ignoreSmaller && meta.width <= width) return console.log(`${feedback} - ignored`);

      img.resize(width, height)
        .withoutEnlargement()
        .crop(sharp.strategy.entropy)
        .jpeg({ progressive: true });
      
      if(buffer)
        img.clone().toBuffer((err, buffer) => fs.writeFile(filename, buffer, (e) => console.log(feedback)));
      else
        img.clone().toFile(filename, (err) => console.log(feedback));

      if(!thumb) return;
      img.resize(thumbWidth, thumbHeight)
        .crop(sharp.strategy.entropy)
        .jpeg({ quality:60, progressive: true });
      
      img.toFile(thumbname);

    });
  });
}

// List all files in a directory in Node.js recursively in a synchronous fashion
function walkSync (dir, filelist?) {
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

export default imageProcessing;