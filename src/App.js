import React from 'react';
import './App.css';
import Drawer from '@material-ui/core/Drawer';
// 这里要用BrowserRouter
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from "@material-ui/core"

import { Config } from "./config.ts"

import Main from "./components/main"
import ImageViewer from "./components/image-viewer"


export default class App extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   drawerOpen: false
    // }
    // // 绑定
    // this.toggleDrawer = this.toggleDrawer.bind(this)
  }
  // // this问题的绑定
  // toggleDrawer() {
  //   // console.log('toggleDrawer', this.toggleDrawer)
  //   this.setState((pre) => {
  //     return { drawerOpen: !pre.drawerOpen }
  //   })
  // }
  render() {
    return (
      // <ThemeProvider theme={Config.theme}>
      //   <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer}>
      //     <div style={{ width: 240 + 'px' }}>TEST</div>
      //   </Drawer>
      //   <h1>drawerOpen: {'' + this.state.drawerOpen}</h1>
      //   <Button variant="contained" color="primary" onClick={this.toggleDrawer}>Open Drawer</Button>
      // </ThemeProvider>
      <div />
    );
  }
}
