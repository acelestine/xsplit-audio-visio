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

// The main procedural shit
(async () => {
  const filePath = path.join(process.cwd(), 'build', 'index.html');
  const stat = await fsp.stat(filePath);
  const doesExist = !!stat;

  if (!doesExist) {
    console.log('CRA output file does not exist');
    return;
  }

  try {
    // Get contents and remove <meta name="xsplit:config-url" content="./props.html" /> tag
    const sourceFileContents = await readFile(filePath);
    const targetFileContents = sourceFileContents.replace(
      '<meta name="xsplit:config-url" content="./props.html"/>',
      ''
    );

    // Create new file called "props.html"
    writeFile(
      path.join(process.cwd(), 'build', 'props.html'),
      targetFileContents
    );

    console.log('Done generating props.html');
  } catch (error) {
    console.log(error.message);
  }
})();
