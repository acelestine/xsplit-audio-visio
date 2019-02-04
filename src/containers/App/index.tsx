import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import SourcePlugin from '../../pages/SourcePlugin';
import Configurator from '../../pages/Configurator';

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
    return <div>{isSourceProps ? <Configurator /> : <SourcePlugin />}</div>;
  }
}

export default App;
