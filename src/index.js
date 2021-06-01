import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Spinner from './_partials/Spinner';
import * as serviceWorker from './serviceWorker';
import firebase from './firebase';
import 'semantic-ui-css/semantic.min.css'
import { HashRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import { setUser , clearUser } from './_actions'

import thunk from 'redux-thunk';
import { compose, applyMiddleware, createStore } from 'redux';
import { Provider, connect } from 'react-redux'
import rootReducer from './_reducers';


const allEnhancers = compose(
  applyMiddleware(thunk),
  //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const store = createStore(rootReducer, allEnhancers);


class Root extends Component {
  componentDidMount() {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if (user) {
          this.props.setUser(user)
          this.props.history.push("/")
        }else {
          this.props.history.push("/login")
          this.props.clearUser();
        }
      })
  }
  render() {
    return this.props.isLoading ? <Spinner /> :  (
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route exact path="/" component={App} />
      </Switch>
    )
  }
}

const mapStateFromProps = state => ({
  isLoading:state.user.isLoading
});

const RootWithAuth = withRouter(
  connect(
    mapStateFromProps, 
    { setUser , clearUser}
    )(Root)
);

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <Router>
        <RootWithAuth />
      </Router>
    </Provider>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
