import xjs from 'xjs-framework/dist/xjs-es2015';

const { isXsplitShell: IS_XSPLIT } = window.external;

export async function getIdentifier(): Promise<string> {
  if (IS_XSPLIT) {
    const source = await xjs.Source.getCurrentSource();
    const id = await source.getId();

    return id;
  }

  return location.origin;
}
