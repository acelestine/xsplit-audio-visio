// Post processing for dev

const path = require('path');
const fs = require('fs');

const fsp = fs.promises;

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath, 'utf8');
    const chunks = [];

    readStream.on('data', chunk => {
      chunks.push(chunk);
    });

    readStream.on('end', () => {
      resolve(chunks.join(''));
    });

    readStream.on('error', error => {
      reject(error);
    });
  });
}

function writeFile(filePath, data) {
  // Not the "correct" way of using createWriteStream, but this will do for now
  return new Promise(resolve => {
    const writeStream = fs.createWriteStream(filePath);

    writeStream.write(data);
    writeStream.end();

    resolve();
  });
}

(async () => {
  console.log('Copying to plg folder...');

  const plgPath = path.join(
    process.cwd(),
    'output',
    'audiovisualizerplg_encrypted.plg'
  );
  const stat = await fsp.stat(plgPath);
  const doesExist = !!stat;

  if (!doesExist) {
    console.log('Cannot locate PLG!');
    process.exit(1);
  }

  try {
    const userFolder =
      process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    const sourceContents = await readFile(plgPath);
    const targetPath = path.join(
      userFolder,
      'AppData',
      'Local',
      'SplitMediaLabs',
      'XSplit',
      'dara@splitmedialabs.com',
      'PlgPlugins3.0',
      'audiovisualizerplg',
      'audiovisualizerplg.plg'
    );

    writeFile(targetPath, sourceContents);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();
