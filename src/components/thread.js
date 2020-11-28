import React from 'react'
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router-dom'
// import { makeStyles, createStyles, withStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DehazeIcon from '@material-ui/icons/Dehaze';
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AtmIcon from '@material-ui/icons/Atm';
import GitHubIcon from '@material-ui/icons/GitHub';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RefreshIcon from '@material-ui/icons/Refresh';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import MuiAlert from '@material-ui/lab/Alert';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import $ from 'jQuery'

// import { PhotoSwipe, PhotoSwipeGallery, PhotoSwipeUI_Default } from 'react-photoswipe';
import _ from "lodash"
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

import Nmb from "../nmb.ts"
import utils from "../utils"
// import { Link } from '@material-ui/core';


function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}


export default class Thread extends React.Component {
  constructor(props) {
    super(props)
    // 绑定
    this.fetchData = this.fetchData.bind(this)
    this.id = props.match.params.id
    if (this.id === undefined)
      this.props.history.go(-1)
    this.styles = {
      cardHead: {
        display: "flex",
        width: "100%",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        color: grey[600]
      },
      cardHeadCookie: { display: "inline-block" },
      cardHeadTime: { display: "inline-block", marginLeft: "5px" },
      cardContentImage: { marginRight: "5px" },
      cardImage: { maxWidth: '150px', maxHeight: '350px', display: 'inline-block' },
      cardContent: { display: "flex" },
      cardText: { width: '100%' },
      menuButton: {
        marginRight: 0,
      },
      title: {
        flexGrow: 1,
        lineHeight: 1.5,
      },
      subTitle: {
        color: grey[300],
        lineHeight: 1,
      },

    }
    this.state = {
      isLoading: true,
      replys: [],
    }
    this.fetchData(1)
    this.replys = {}
  }

  parseQuote(src) {
    // 去除开头的>号
    while (src[0] === '>' && src.length > 0)
      src = src.replace('>', '')
    if (!src.startsWith('No.'))
      return '0'
    src = src.replace('No.', '')
    return src
  }

  // 动态生成原生dom
  createNativeQuote(data, options) {
    if (!options)
      options = {}
    let styleQuote = {
      borderLeft: '5px solid ' + utils.colorHex('rgb(99,190,183)'),
      background: utils.colorHex('rgb(224,242,242)'),
      // padding: "5px 10px",
      margin: '0px 0px 0px 15px',
      color: 'black'
    }
    let innerHTML = ''
    let element = <blockquote style={styleQuote}>
      {this.createReply(data, {
        noShowDivider: true,
        noShowId: true,
        showJump: options.showJump,
      })}
    </blockquote>
    let tmp = $('<div></div>')
    ReactDOM.render(element, tmp[0])
    // hydrate没用
    // ReactDOM.hydrate(element, tmp[0])
    // console.log(tmp, $(tmp).html())
    innerHTML = $(tmp).html()
    return innerHTML
  }

  fetchData(page) {
    Nmb.getTheard(this.id, page).then((response) => {
      let data = response.data
      this.po = data
      if (!data.replys) {
        console.log('data.replys undefined', data)
        this.setState({ isLoading: false })
        return
      }
      console.log('getTheard', this.id, 'fertched', data.replys.length, 'reply(s)')
      this.setState((pre) => {
        let tmp = _.cloneDeep(pre.replys)
        for (let reply of data.replys) {
          tmp.push(reply)
          this.replys[reply.id] = reply
        }
        return {
          replys: tmp
        }
      }, () => {
        // 设置全局的<font>点击事件
        $('font').click((event) => {
          // console.log($(event.target).text())
          if (event.target.nodeName !== 'FONT')
            return
          // console.log(event)
          let src = $(event.target).text()
          let targetId = '' + this.parseQuote(src)
          // 如果找到
          if (this.replys[targetId]) {
            let data = this.replys[targetId]
            $(event.target).html($(event.target).html() + this.createNativeQuote(data))
          }
          // 找不到就另开
          else {
            $(event.target).off('click')
            Nmb.getTheard(targetId, 1).then((response) => {
              // console.log(response)
              if (response.data.content)
                $(event.target).html($(event.target).html() + this.createNativeQuote(response.data, {
                  showJump: true
                }))
              else
                $(event.target).html('<span style="color: red">(该主题不存在)</span>')
            })
          }
        })
      })
      if (data.replys.length <= 20)
        this.setState({ isLoading: false })
      setTimeout(function () {
        // console.log('excute click')
        $('font').click();
      }, 500)
    })
  }

  createReply(data, options) {
    if (options === undefined)
      // 默认全部是false
      options = {
        noShowId: false,
        noShowDivider: false,
        showJump: false,
      }
    if (data === undefined)
      return undefined
    // 过滤广告
    // console.log('createReply', data)
    if (data.id == 9999999)
      return undefined
    let tmpStyles = _.cloneDeep(this.styles)
    if (data.admin !== '0') {
      tmpStyles.cardHeadCookie.color = red[600]
      tmpStyles.cardHeadCookie.fontWeight = 600
    }
    // console.log('createReply', data)
    if (data.userid == this.po.userid) {
      tmpStyles.cardHeadCookie.color = 'black'
      tmpStyles.cardHeadCookie.fontWeight = 600
    }


    let imgRes = (data.img !== undefined && data.img !== '') ? <img alt="" style={tmpStyles.cardImage}
      src={Nmb.CDN_THUMB + data.img + data.ext}
      onClick={(event) => {
        // 解决点击重叠问题
        event.stopPropagation()
        // console.log("Image Clicked!")
        this.props.history.push('/image-viewer/' + window.btoa(Nmb.CDN_IMG + data.img + data.ext))
      }}
      className={'img' + window.btoa(data.img)}
      style={tmpStyles.cardContentImage}
    /> : undefined

    let contentDom = undefined

    if (data.content) {
      // 默认展开第一层引用
      let contentHtml = data.content.replace(/<\/font><br \/>/g, '</font>')
      contentDom = $('<div>' + contentHtml + '</div>')
      let query = $('font', contentDom)
      if (query.length > 0) {
        // // 只有一个font元素
        // let font = query[0]
        // console.log('get font', font, data)
        // let targetId = this.parseQuote($(font).text())
        // if (this.replys[targetId]) {
        //   let data = this.replys[targetId]
        //   $('font', contentDom).html($(font).html() + this.createNativeQuote(data))
        //   console.log('set font', this.createNativeQuote(data))
        // }
      }
    } else {
      console.log('content undefined', data)
      contentDom = $('<div>' + data.content + '</div>')
    }
    console.log(contentDom.html())

    let content = <div style={tmpStyles.cardText}
      dangerouslySetInnerHTML={{ __html: $(contentDom).html() }}></div>
    // console.log(content)
    let userid = options.noShowId ? undefined : 'No.' + data.id
    let divider = options.noShowDivider ? undefined : <Divider light />
    // let jump = options.showJump ? <a href={'javascript: history.pushState("/thread/" + ' + data.id + ')'}>跳转该串</a> : undefined
    let jump = undefined

    return (
      <div>
        <div style={{
          padding: "10px",
          // width: "100%"
        }}>
          <div style={tmpStyles.cardHead}>
            <div>
              <div style={tmpStyles.cardHeadCookie}>{data.userid}</div>
              <div style={tmpStyles.cardHeadTime}>{utils.showTime(data.now)}</div>
            </div>
            {/* <Link href={'/thread/' + data.id}>跳转该串</Link> */}
            <div>{userid}{jump}</div>
          </div>
          <div style={tmpStyles.cardContent}>
            <div>
              {imgRes}
            </div>
            {content}
          </div>
        </div>
        {divider}
      </div>
    )
  }

  render() {
    let progress = this.state.isLoading ? <LinearProgress color="secondary" /> : <div />
    let replys = [this.createReply(this.po)]
    for (let r of this.state.replys)
      replys.push(<div key={r.id}>
        {this.createReply(r)}
      </div>)

    return (
      <div className="root-thread">
        <AppBar>
          {progress}
          <Toolbar id="back-to-top-anchor">
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {
              this.props.history.go(-1)
            }}>
              <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
            <div>
              <Typography variant="h6" style={this.styles.title}>
                速报观察
              </Typography>
              {/* <Typography variant="h6">
                {'No.' + this.id}
              </Typography> */}
              <Typography variant="caption" display="block" gutterBottom style={this.styles.subTitle}>
                {'>>No.' + this.id}
              </Typography>
            </div>
          </Toolbar>
        </AppBar>

        {/* 一个AppBar高度 */}
        <div style={{ marginTop: 64 + 'px' }}></div>

        {/* {progress} */}

        <div className="container-main">
          <div>
            {replys}
          </div>
        </div>
      </div>
    )
  }
}