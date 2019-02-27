// The communicator, it abstracts xjs's requestSaveConfig just so that we can
// have the same API when developing in the browser
//
// As you might guess by now, I'm not running on Windows in my personal laptop
// which is why I have to make do on mimicking what the final end product would
// behave. Gomen.

import xjs from 'xjs-framework/dist/xjs-es2015';
import { isSourceProps } from './environment';

interface CallbackStackType {
  type: string;
  callback: Function;
}

const { isXsplitShell: IS_XSPLIT } = window.external;

// Mutable stuff
let configObj: any = {};
let pluginInstance: any = null;
let pluginPropsInstance: any = null;
let callbackStack: Array<CallbackStackType> = [];

async function initialize() {
  if (!IS_XSPLIT) {
    return;
  }

  if (pluginInstance === null) {
    const Source = xjs.Source;
    pluginInstance = await Source.getCurrentSource();
  }

  configObj = await pluginInstance.loadConfig();

  if (pluginPropsInstance === null && !isSourceProps()) {
    const SourcePluginWindow = xjs.SourcePluginWindow;
    pluginPropsInstance = SourcePluginWindow.getInstance();
  }
}

export async function requestSaveConfig(config: any) {
  await initialize();

  if (!isSourceProps()) {
    throw new Error('mga mangmang');
  }

  if (IS_XSPLIT) {
    pluginInstance.requestSaveConfig({ ...configObj, ...config });
  } else if (window.opener) {
    window.opener.postMessage({ type: 'save-config', ...config });
  }
}

export async function applyConfig(config: any) {
  await initialize();

  if (!isSourceProps()) {
    throw new Error('mga tanga');
  }

  if (IS_XSPLIT) {
    pluginInstance.applyConfig({ ...configObj, ...config });
  } else if (window.opener) {
    window.opener.postMessage({ type: 'apply-config', ...config });
  }
}

export async function addListener(type: string, callback: Function) {
  await initialize();

  if (isSourceProps() && IS_XSPLIT) {
    throw new Error('mga bobo');
  }

  if (IS_XSPLIT) {
    pluginPropsInstance.on(type, (...args: any) => callback(...args)); // Why dis happening? dunno...
  } else if (window.opener) {
    callbackStack.push({ type, callback });
  }
}

export async function removeListener(type: string, callback: Function) {
  await initialize();

  if (isSourceProps()) {
    throw new Error('mga inutil');
  }

  if (IS_XSPLIT) {
    pluginPropsInstance.off(type, callback);
  } else if (window.opener) {
    const index = callbackStack.findIndex(
      cb => cb.type === type && cb.callback === callback
    );

    callbackStack = [
      ...callbackStack.slice(0, index),
      ...callbackStack.slice(index + 1, callbackStack.length + 1),
    ];
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
