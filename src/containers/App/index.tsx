import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import SourcePlugin from '../../pages/SourcePlugin';
import Configurator from '../../pages/Configurator';

class App extends React.Component {
  state = {
    isSourceProps: false,
  };

  componentDidMount() {
    xjs.ready().then(() => {
      this.setState({ isSourceProps: xjs.Environment.isSourceProps() });
    });
  }

  render() {
    const { isSourceProps } = this.state;
    return <div>{isSourceProps ? <Configurator /> : <SourcePlugin />}</div>;
  }
}

export default App;
