// The communicator, it abstracts xjs's requestSaveConfig just so that we can
// have the same API when developing in the browser
//
// As you might guess by now, I'm not running on Windows in my personal laptop
// which is why I have to make do on mimicking what the final end product would
// behave. Gomen.

import xjs from 'xjs-framework/dist/xjs-es2015';

interface CallbackStackType {
  type: string;
  callback: Function;
}

const { isXsplitShell: IS_XSPLIT } = window.external;

// Mutable stuff
let isSourceProps: any = null;
let pluginInstance: any = null;
let callbackStack: Array<CallbackStackType> = [];

async function initialize() {
  if (isSourceProps === null) {
    isSourceProps = xjs.Environment.isSourceProps();
  }

  if (pluginInstance === null) {
    const Source = xjs.Source;
    pluginInstance = await Source.getCurrentSource();
  }
}

export async function requestSaveConfig(config: any) {
  await initialize();

  if (!isSourceProps) {
    throw new Error('mga tanga');
  }

  if (IS_XSPLIT) {
    pluginInstance.requestSaveConfig(config);
  } else if (window.opener) {
    window.opener.postMessage({ type: 'save-config', ...config });
  }
}

export async function applyConfig(config: any) {
  await initialize();

  if (!isSourceProps) {
    throw new Error('mga tanga');
  }

  if (IS_XSPLIT) {
    pluginInstance.requestSaveConfig(config);
  } else if (window.opener) {
    window.opener.postMessage({ type: 'apply-config', ...config });
  }
}

export async function addListener(type: string, callback: Function) {
  await initialize();

  if (isSourceProps) {
    throw new Error('mga bobo');
  }

  if (IS_XSPLIT) {
    pluginInstance.on(type, callback);
  } else if (window.opener) {
    callbackStack.push({ type, callback });
  }
}

function handleMessage(event: any) {
  const { data } = event;
  const { type } = data;
  const callbacks = callbackStack.filter(
    (cb: CallbackStackType) => cb.type === type
  );

  callbacks.forEach((cb: CallbackStackType) => cb.callback(data));
}

if (!IS_XSPLIT) {
  window.addEventListener('message', handleMessage, false);
}
