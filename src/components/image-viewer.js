import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Container from '@material-ui/core/Container';
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import grey from "@material-ui/core/colors/grey"
import red from "@material-ui/core/colors/red"
import LinearProgress from '@material-ui/core/LinearProgress';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

import Nmb from "../nmb.ts"
import utils from "../utils"

// import Nmb from "../nmb.ts"

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    console.log(this.props)
    console.log(this.props.routeParams)
    this.url = window.atob(props.match.params._url)
    console.log('url', this.url)
  }

  goBack() {
    this.props.history.pop()
  }

  render() {
    let viewer = undefined
    return (
      <div style={{ height: "100%" }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {
              this.props.history.go(-1)
            }}>
              <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container>
          <div style={{ height: "100%", margin: 'auto' }}>
            <img id="image" alt="" src={this.url}
              onLoad={() => {
                viewer = new Viewer(document.querySelectorAll('#image')[0], {
                  inline: true,
                  viewed() {
                    viewer.zoomTo(1);
                  },
                });
              }} />
          </div>
        </Container>
      </div>
    )
  }
}


