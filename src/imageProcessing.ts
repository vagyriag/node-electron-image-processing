const fs = require('fs'),
      sharp = require('sharp'),
      rimraf = require('rimraf'),
      mkdirp = require('mkdirp');

var logger = defaultLogger;

function process ({ 
      origin, destination = 'result',
      thumb, rename, ignoreSmaller, cleanDestination, buffer,
      width = 800, height = undefined, thumbWidth = 220, thumbHeight = 150 
    }: {
      origin: string, destination?: string,
      thumb?: boolean, rename?: boolean, ignoreSmaller?: boolean, cleanDestination?: boolean, buffer?: boolean,
      width?: number, height?: number, thumbWidth?: number, thumbHeight?: number,
    }) {

  // mandatory origin
  if(!origin) return logger('no-origin');

  // no cache with buffer (overwrite)
  if(buffer) sharp.cache(false);

  // clean destination folder (DANGER)
  if(cleanDestination) logger('cleaning'), rimraf.sync(destination);

  // files array
  var list = getImageList(origin),
      count = 0, lastFolder, lastIndex;

  logger('start', { total: list.length });

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
      const filename = `${folder}/${name}.jpg`,
        thumbname = `${folder}/${name}_thumb.jpg`,
        log = (more?) => (logger('progress', { count: ++count, total: list.length, ...more }), (count === list.length && logger('end')));

      if(ignoreSmaller && meta.width <= width) return log({ ignored: true });

      img.resize(width, height)
        .crop(sharp.strategy.entropy)
        .jpeg({ progressive: true });
      
      if(buffer)
        img.clone().toBuffer((err, buffer) => fs.writeFile(filename, buffer, (e) => log()));
      else
        img.clone().toFile(filename, (e) => log());

      if(count === list.length) logger('end');

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

function getImageList (dir) {
  if(!/\/$/.test(dir)) dir += '/';
  return walkSync(dir).filter(f => /\.(jpg|png|tif)$/i.test(f));
}

function defaultLogger (type: string, data?: any){
  console.log((() => {
    switch(type){
      case 'no-origin': return '--origin is mandatory';
      case 'cleaning': return 'cleaning destination...';
      case 'start': return `Total: ${data.total}`;
      case 'progress': return `progress: ${data.count} of ${data.total}`;
    }
  })());
}

export default {
  process,
  getImageList,
  setLogger: (log: (type: string, data?: any) => void) => logger = log,
};