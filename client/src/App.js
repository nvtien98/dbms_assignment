import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from './_utils/history';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegistePage';
import HomePage from './pages/HomePage/HomePage';
import PrivateRoute from './_utils/PrivateRoute';
import { alertActions } from './_actions/alert.actions';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { alert } = this.props;
    return (
      <div>

        {alert.message &&
          <div className="col-sm-8 col-sm-offset-2">
            <div className={`alert ${alert.type}`} style={{ marginTop: '50px' }}>{alert.message}</div>
          </div>
        }

        <Router history={history}>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute exact path="/" component={HomePage} />
            <PrivateRoute exact path='/:roomID' component={HomePage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { alert } = state;
  return { alert };
}

const actionCreators = {
  clearAlerts: alertActions.clear
};

const connectedApp = connect(mapStateToProps, actionCreators)(App);
export { connectedApp as App };
