import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';
import { ThemeProvider } from 'react-jss';

import SourcePlugin from '../../pages/SourcePlugin';
import Configurator from '../../pages/Configurator';

import theme from '../../themes/default';

class App extends React.Component {
  state = {
    isSourceProps: false,
  };

  componentDidMount() {
    if (window.external.isXSplit) {
      xjs.ready().then(() => {
        this.setState({ isSourceProps: xjs.Environment.isSourceProps() });
      });
    } else {
      // Check has route
      const hash = location.hash;
      this.setState({ isSourceProps: hash === '#sourceprops' });
    }
  }

  render() {
    const { isSourceProps } = this.state;
    return (
      <ThemeProvider theme={theme}>
        {isSourceProps ? <Configurator /> : <SourcePlugin />}
      </ThemeProvider>
    );
  }
}

export default App;
