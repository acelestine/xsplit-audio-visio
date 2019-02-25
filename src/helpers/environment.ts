import xjs from 'xjs-framework/dist/xjs-es2015';

const { isXsplitShell: IS_XSPLIT } = window.external;

export function isSourceProps() {
  if (IS_XSPLIT) {
    return xjs.Environment.isSourceProps();
  }

  const hash = location.hash;
  return hash === '#sourceprops';
}
