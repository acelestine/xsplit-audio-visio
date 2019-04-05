const { htmlEncode } = require('htmlencode');
const cheerio = require('cheerio');
const path = require('path');
const fsExtra = require('fs-extra');
const fs = require('fs');
const process = require('process');

const appFolder = path.join(process.cwd(), 'build');
const outputFolder = path.join(process.cwd(), 'output');

function main() {
  const source = parseHTML(path.join(appFolder, 'index.html'));

  if (!fs.existsSync(outputFolder)) {
    fsExtra.mkdir(outputFolder);
  }

  fsExtra.removeSync(path.join(outputFolder, 'audio-visio.html'));
  fs.writeFileSync(path.join(outputFolder, 'audio-visio.html'), source);
  console.info(
    'Finished writing to: ' + path.join(outputFolder, 'audio-visio.html')
  );
}

function parseHTML(filepath, options = {}) {
  console.info('Parsing HTML: ' + filepath + '...');

  const currentPath = path.dirname(filepath);
  const $ = cheerio.load(fs.readFileSync(filepath));

  $('link[href]').each(function() {
    const $this = $(this);
    const href = $this.attr('href');
    const rel = $this.attr('rel');
    const htmlencode = $this.attr('htmlencode');

    if ($this.attr('external') !== undefined) {
      return;
    }

    const normalizedPath = path.normalize(currentPath + '/' + href);

    if (rel === 'import') {
      if (!/.xml$/.test(href)) {
        $this.replaceWith(
          parseHTML(normalizedPath, {
            htmlencode: String(htmlencode) === 'true',
          })
        );
      }
    } else if (rel === 'stylesheet') {
      $this.replaceWith(parseCSS(normalizedPath));
    } else {
      return;
    }
  });

  $('script[src]').each(function() {
    const $this = $(this);
    const src = $this.attr('src');
    const type = $this.attr('type');

    if ($this.attr('external') !== undefined) {
      return;
    }

    if (type === 'lang') {
      $this.removeAttr('type');
      $this.removeAttr('src');

      const langmodule = src.replace(/.*\/|\.json/g, '');

      console.info('Parsing Language: ' + src + '...');

      const content = fs.readFileSync(currentPath + '\\' + src);

      $this.html(`window.addEventListener("load", function(){
                  External.Lang.register("${langmodule}", ${content});
              });`);

      console.info('Parsing Language: ' + src + '[DONE]');
    } else {
      let normalizedPath = path.normalize(currentPath + '/' + src);
      $this.replaceWith(parseJS(normalizedPath));
    }
  });

  const imgPattern = /=[ ]?'(.[^']+\.(jpg|png))'/gi;
  let html = $.html();

  html = removeDebugCodes(html);

  if (options.htmlencode) {
    // Convert existing '&' to &amp;
    html = html.replace(/\&/g, '&amp;');
    html = htmlEncode(html);
  }

  // replace images with base64
  html = html.replace(imgPattern, (match, path) => {
    if (!fs.existsSync(currentPath + '/' + path)) {
      return match;
    }

    const file = fs.readFileSync(currentPath + '/' + path);
    const fileBuffer = new Buffer(file, 'binary');
    const base64File = fileBuffer.toString('base64');

    return "='data:;base64," + base64File + '\\';
  });

  // Remove new lines on plugin tag
  html = html.replace(
    /(<plugin.*>)([\r\n ]*)/i,
    (match, pluginTag) => pluginTag
  );

  // Check for imports with xml file type
  const pluginXMLTag = /<plugin_xml>[\r\n ]*(<link.+>)[\r\n ]*<\/plugin_xml>/i.exec(
    html
  );

  if (pluginXMLTag && pluginXMLTag.length > 0) {
    const link = pluginXMLTag[1];
    const href = /href=['"](.+)['"]/i.exec(link);
    const normalizedPath = path.normalize(currentPath + '/' + href[1]);
    const content = fs.readFileSync(normalizedPath, 'utf8');

    html = html.replace(
      /<plugin_xml>[\r\n ]*(<link.+>)[\r\n ]*<\/plugin_xml>/i,
      () => '<plugin_xml>' + content + '</plugin_xml>'
    );
  }

  console.info('Parsing HTML: ' + filepath + ' [DONE]');

  return html;
}

function parseCSS(cssFile) {
  console.info('Parsing CSS: ' + cssFile + '...');

  const cssContent = fs.readFileSync(cssFile);
  const cssPath = path.normalize(path.dirname(cssFile));
  let html = '<style>' + cssContent + '</style>';

  html = html.replace(/src:url\(['"]?(.[^'"\)]+)['"]?\)/gi, (match, path) => {
    const file = fs.readFileSync(cssPath + '/' + path);
    const fileBuffer = new Buffer(file, 'binary');
    const base64File = fileBuffer.toString('base64');

    return "src:url('data:;base64," + base64File + "')";
  });

  console.info('Parsing CSS: ' + cssFile + ' [DONE]');

  return removeDebugCodes(html);
}

function parseJS(jsFile) {
  console.info('Parsing JS: ' + jsFile + '...');

  const jsContent = fs.readFileSync(jsFile);
  const html = '<script>' + jsContent + '</script>';

  console.info('Parsing JS: ' + jsFile + ' [DONE]');

  return removeDebugCodes(html);
}

function removeDebugCodes(code) {
  const BEGIN_DEBUG_PATTERN = /(\/[\/\*]|<!--)\s*BEGIN DEBUG\s*(-->|\*\/)?/gi;
  const END_DEBUG_PATTERN = /(\/[\/\*]|<!--)\s*END DEBUG\s*(-->|\*\/)?/gi;
  const FIRST_GROUP_PATTERN = /^(\/[\/\*]|<!--)$/;
  const SECOND_GROUP_PATTERN = /^(-->|\*\/)$/;

  let resultantCode = '';
  let codeFragments = code.split(BEGIN_DEBUG_PATTERN);

  resultantCode += codeFragments.shift();

  while (codeFragments.length > 0) {
    let fragment = codeFragments.shift();

    if (
      fragment === undefined ||
      FIRST_GROUP_PATTERN.test(fragment) ||
      SECOND_GROUP_PATTERN.test(fragment)
    ) {
      continue;
    }

    let splittedFragment = fragment.split(END_DEBUG_PATTERN);

    if (splittedFragment.length > 1) {
      fragment = splittedFragment[splittedFragment.length - 1];
    }

    resultantCode += fragment;
  }

  return resultantCode;
}

main();
