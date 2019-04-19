import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';
import { ThemeProvider } from 'react-jss';

import SourcePlugin from '../../pages/SourcePlugin';
import Configurator from '../../pages/Configurator';

import theme from '../../themes/default';

function getMetaContent() {
  if (location.origin !== 'file://') {
    return location.origin;
  }

  const captured = /.+\/([\w\W]+)\.(\w+)/gm.exec(location.href);

  if (captured) {
    const [fullPath, filename, extension] = captured;

    return `./${filename}.${extension}`;
  }

  return '';
}

class App extends React.Component {
  state = {
    isInitialized: false,
    isSourceProps: false,
  };

  componentDidMount() {
    const content = getMetaContent();

    if (content) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'xsplit:config-url');
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    }

    if (window.external.isXsplitShell) {
      xjs.ready().then(() => {
        this.setState({
          isSourceProps: xjs.Environment.isSourceProps(),
          isInitialized: true,
        });
      });
    } else {
      // Check has route
      const hash = location.hash;
      const isSourceProps = hash === '#sourceprops';
      this.setState({ isSourceProps, isInitialized: true });

      // Also, if it isn't isSourceProps, we should open it just to "mock" HTML Plugin <-> Source Props communication
      window.open(`${window.location.origin}/#sourceprops`, 'sourceProps');
    }
  }

  render() {
    const { isSourceProps, isInitialized } = this.state;

    if (!isInitialized) {
      return null;
    }

    return (
      <ThemeProvider theme={theme}>
        <>{isSourceProps ? <Configurator /> : <SourcePlugin />}</>
      </ThemeProvider>
    );
  }
}

export default App;
