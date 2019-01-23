import * as React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

// Pages
import SourcePlugin from './pages/SourcePlugin';
import Configurator from './pages/Configurator';

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/" component={SourcePlugin} />
      <Route path="/config" component={Configurator} />
    </Switch>
  </Router>
);

export default Routes;
