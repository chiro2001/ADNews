import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import Drawer from '@material-ui/core/Drawer';
// 这里要用BrowserRouter
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles';

import { Config } from "./config.ts"

import Main from "./components/main"
import Thread from "./components/thread"
import ImageViewer from "./components/image-viewer"
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   // <React.StrictMode>
//     <App />,
//   // </React.StrictMode>,
//   document.getElementById('root')
// );

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

ReactDOM.render(
  <ThemeProvider theme={Config.theme}>
    <Router>
      <Route path="/" component={App} />
      <Route path='/main' component={Main} />
      <Route path='/thread/:id' component={Thread} />
      <Route path='/image-viewer/:_url' component={ImageViewer} />
      <Redirect from="/" to="/main" />
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

