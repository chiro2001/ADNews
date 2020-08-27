import React from 'react'
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
import RefreshIcon from '@material-ui/icons/Refresh';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Drawer from '@material-ui/core/Drawer';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import MuiAlert from '@material-ui/lab/Alert';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';

// import { PhotoSwipe, PhotoSwipeGallery, PhotoSwipeUI_Default } from 'react-photoswipe';
import _ from "lodash"
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

import Nmb from "../nmb.ts"
import utils from "../utils"

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function ScrollTop(props) {
  const { children, window } = props;
  // const classes = useStyles();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" style={{
        position: 'fixed',
        // bottom: theme.spacing(2),
        // right: theme.spacing(2),
        bottom: '3%',
        right: '3%',
      }}>
        {children}
      </div>
    </Zoom>
  );
}



export default class Main extends React.Component {
  constructor(props) {
    super(props)
    utils.showTimeInit()
    // 绑定
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.addOldThreads = this.addOldThreads.bind(this)
    this.saveNowThreads = this.saveNowThreads.bind(this)
    this.fetchDone = this.fetchDone.bind(this)
    this.addChosedOldThreads = this.addChosedOldThreads.bind(this)
    // 速报版id是121
    this.state = {
      drawerOpen: false,
      isLoading: true,
      isImageOpen: false,
      threads: [],
      imageLoaded: {},
      // 多选模式
      muiChoise: false,
      // checkedThreads: {},
    }
    this.checkedThreads = {}
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
      cardText: {},
      menuButton: {
        marginRight: 0,
      },
      title: {
        flexGrow: 1,
      },
    }
    // 获取致闻
    this.oldThreads = JSON.parse(localStorage.getItem('oldThreads'))
    if (this.oldThreads === undefined || this.oldThreads === null) {
      this.oldThreads = {}
      localStorage.setItem('oldThreads', JSON.stringify({}))
    }
    if (!localStorage.getItem('nowThreads')) {
      localStorage.setItem('nowThreads', JSON.stringify([]))
    }
  }
  // this问题的绑定
  toggleDrawer() {
    // console.log('toggleDrawer', this.toggleDrawer)
    this.setState((pre) => {
      return { drawerOpen: !pre.drawerOpen }
    })
  }

  addOldThreads() {
    for (let i of this.state.threads) {
      this.oldThreads['' + i.id] = i
    }
    localStorage.setItem('oldThreads', JSON.stringify(this.oldThreads))
    // // 刷新
    // window.location.reload();
    // 删除所有的串
    this.setState({
      threads: []
    }, () => {
      // 保存
      localStorage.setItem('nowThreads', JSON.stringify(this.state.threads))
    })
  }

  addChosedOldThreads() {
    let tmp = _.cloneDeep(this.state.threads)
    Object.keys(this.checkedThreads).forEach((key) => {
      if (this.checkedThreads[key] !== true)
        return
      for (let i of tmp) {
        if (i.id === key) {
          tmp.remove(i)
          this.oldThreads[i.id] = i
          return
        }
      }
    })
    localStorage.setItem('oldThreads', JSON.stringify(this.oldThreads))
    this.setState({
      threads: tmp
    }, () => {
      // 保存
      localStorage.setItem('nowThreads', JSON.stringify(this.state.threads))
    })
  }

  // 单个标记致闻
  addToOldThreads(thread) {
    this.oldThreads['' + thread.id] = thread
    localStorage.setItem('oldThreads', JSON.stringify(this.oldThreads))
  }

  // 保存正在浏览的串到本地储存
  saveNowThreads() {
    localStorage.setItem('nowThreads', JSON.stringify(this.state.threads))
  }

  // 组件第一次渲染完成
  componentDidMount() {
    console.log('componentDidMount')
    console.log(JSON.parse(localStorage.getItem('nowThreads')))
    // 获取上次没看完的串
    this.setState({
      threads: JSON.parse(localStorage.getItem('nowThreads'))
    })
    this.fetchData(1)
  }

  // 预先处理数据
  preParse(data) {
    // 直接处理字符串
    data.now = Date.parse(data.now)
    return data
  }

  // 数据获取完成
  fetchDone() {
    this.setState((pre) => {
      let tmp = _.cloneDeep(pre.threads).sort((a, b) => {
        return b.now - a.now
      })
      // console.log('threads', pre.threads)
      // console.log('tmp', tmp)
      return {
        isLoading: false,
        threads: tmp
      }
    }, () => {
      this.saveNowThreads()
    })
  }

  fetchData(page) {
    Nmb.getThreadList(121, page).then((data) => {
      // console.log(data)
      console.log('fetched page', page, 'got', data.data.length, 'thread(s)')
      this.setState((pre) => {
        let tmp = pre.threads
        // 不考虑已经存在浏览区的串
        let nowThreadsIds = {}
        for (let j of this.state.threads)
          nowThreadsIds[j.id] = true
        for (let i of data.data) {
          // tmp.push(i)
          // 不考虑致闻
          if (this.oldThreads['' + i.id] !== undefined)
            continue
          // 这个串是不是存在在浏览区
          if (nowThreadsIds['' + i.id]) {
            // 找到这个串
            for (let j=0; j<this.state.threads.length; j++) {
              if (this.state.threads[j].id === i.id) {
                // 找到了就替换
                this.setState((pre) => {
                  let tmp2 = _.cloneDeep(pre.threads)
                  tmp2[j] = i
                  return {
                    threads: tmp2
                  }
                })
                break
              }
            }
          }
          else
            tmp.push(this.preParse(i))
          // console.log(i)
        }
        return {
          threads: tmp
        }
      })
      if (data.data.length === 20)
        this.fetchData(page + 1)
      else {
        // 数据获取完成
        this.fetchDone()
      }
    })
  }

  createThreadCard(data) {
    // admin: "0"
    // content: "美股开盘大跌<br />↵道琼斯直接熔断"
    // email: ""
    // ext: ".jpg"
    // id: "24579900"
    // img: "2020-03-12/5e6a397c2ee8a"
    // name: "无名氏"
    // now: "2020-03-12(四)21:30:36"
    // remainReplys: 7572
    // replyCount: "7577"
    // replys: Array(5)
    // 0: {id: "29651016", img: "", ext: "", now: "2020-08-21(五)13:02:21", userid: "BfDs2WM", …}
    // 1: {id: "29651143", img: "", ext: "", now: "2020-08-21(五)13:08:21", userid: "Jt6HhHm", …}
    // 2: {id: "29651235", img: "", ext: "", now: "2020-08-21(五)13:12:03", userid: "3lY4U7o", …}
    // 3: {id: "29692176", img: "", ext: "", now: "2020-08-22(六)21:01:25", userid: "EGWKZbU", …}
    // 4: {id: "29706310", img: "", ext: "", now: "2020-08-23(日)10:25:12", userid: "gxIlxgf", …}
    // length: 5
    // sage: "0"
    // status: "n"
    // title: "无标题"
    // userid: "L5EZGwy"

    // var tmpStyles = this.styles
    let tmpStyles = _.cloneDeep(this.styles)
    if (data.admin !== '0')
      tmpStyles.cardHeadCookie.color = red[600]
    let imgTop = (data.img !== undefined && data.img !== '') ? <img alt="" style={tmpStyles.cardImage}
      src={Nmb.CDN_THUMB + data.img + data.ext}
      onClick={(event) => {
        // 解决点击重叠问题
        event.stopPropagation()
        console.log("Image Clicked!")
        this.props.history.push('/image-viewer/' + window.btoa(Nmb.CDN_IMG + data.img + data.ext))
      }}
      className={'img' + window.btoa(data.img)}
      style={tmpStyles.cardContentImage}
    /> : undefined
    let imgRes = imgTop

    if (this.checkedThreads[data.id] === undefined)
      this.checkedThreads[data.id] = false

    let muiChoiseBox = (this.state.muiChoise && !data.maxWidth) ? <Checkbox
      defaultChecked={false}
      // checked={this.checkedThreads[data.id]}
      // checked={checked}
      onClick={(event) => {
        event.stopPropagation()
        // console.log('checkbox', event)
        // this.setState((pre) => {
        //   let tmp = _.cloneDeep(pre.checkedThreads)
        //   tmp['' + data.id] = !tmp['' + data.id]
        //   return {
        //     checkedThreads: tmp
        //   }
        // })
      }}
      onChange={(event) => {
        // console.log(_.cloneDeep(event))
        // console.log(event.target.checked)
        this.checkedThreads[data.id] = event.target.checked
        // console.log(this.checkedThreads)
      }}
    // onClick={(event) => {
    //   event.stopPropagation()
    // }}
    /> : undefined

    return (
      <Paper elevation={3} style={{
        padding: "10px",
        width: data.maxWidth ? "100%" : undefined
      }}
        onClick={() => {
          console.log("Thread Clicked!")
          this.props.history.push('/thread/' + data.id)
        }} >
        <div style={tmpStyles.cardHead}>
          <div>
            <div style={tmpStyles.cardHeadCookie}>{data.userid}</div>
            <div style={tmpStyles.cardHeadTime}>{utils.showTime(data.now)}</div>
          </div>
          <div className="card-head-count">{data.replyCount}</div>
          {muiChoiseBox}
        </div>
        <div style={tmpStyles.cardContent}>
          <div>
            {imgRes}
          </div>
          <div style={tmpStyles.cardText} dangerouslySetInnerHTML={{ __html: data.content }}></div>
        </div>
      </Paper>
    )
  }

  render() {

    let threads = []

    // admin: "0"
    // content: "美股开盘大跌<br />↵道琼斯直接熔断"
    // email: ""
    // ext: ".jpg"
    // id: "24579900"
    // img: "2020-03-12/5e6a397c2ee8a"
    // name: "无名氏"
    // now: "2020-03-12(四)21:30:36"
    // remainReplys: 7572
    // replyCount: "7577"
    // replys: Array(5)
    // 0: {id: "29651016", img: "", ext: "", now: "2020-08-21(五)13:02:21", userid: "BfDs2WM", …}
    // 1: {id: "29651143", img: "", ext: "", now: "2020-08-21(五)13:08:21", userid: "Jt6HhHm", …}
    // 2: {id: "29651235", img: "", ext: "", now: "2020-08-21(五)13:12:03", userid: "3lY4U7o", …}
    // 3: {id: "29692176", img: "", ext: "", now: "2020-08-22(六)21:01:25", userid: "EGWKZbU", …}
    // 4: {id: "29706310", img: "", ext: "", now: "2020-08-23(日)10:25:12", userid: "gxIlxgf", …}
    // length: 5
    // sage: "0"
    // status: "n"
    // title: "无标题"
    // userid: "L5EZGwy"

    let progress = this.state.isLoading ? <LinearProgress color="secondary" /> : <div />

    for (let i of this.state.threads) {
      // console.log(i)
      threads.push(<div key={this.state.threads.indexOf(i)}>
        {this.createThreadCard(i)}
        <br />
      </div>)
    }

    let empty = this.state.threads.length === 0 ? <div><br /><Alert severity="info">你没有未看过的串，你没有致。</Alert></div> : <div />

    let oldThreads = []
    Object.keys(this.oldThreads).forEach((key) => {
      let tmp = _.cloneDeep(this.oldThreads[key])
      tmp.maxWidth = true
      oldThreads.push(<div key={tmp.now}>
        {this.createThreadCard(tmp)}
        <br />
      </div>)
    })
    oldThreads.reverse()

    return (
      <div className="root-main" >
        <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer}>
          <div style={{ width: 240 + 'px' }}>
            <List component="nav" aria-label="main mailbox folders">
              <ListItemLink button href='https://adnmb.com/'>
                <ListItemIcon>
                  <AtmIcon />
                </ListItemIcon>
                <ListItemText primary="主站" />
              </ListItemLink>
              <ListItemLink button href='https://gitee.com/chiro2001/ADNews'>
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                <ListItemText primary="关于" />
              </ListItemLink>
            </List>
          </div>
        </Drawer>
        <AppBar>
          {progress}
          <Toolbar id="back-to-top-anchor">
            <IconButton edge="start" style={this.styles.menuButton} color="inherit" aria-label="menu" onClick={this.toggleDrawer}>
              <DehazeIcon></DehazeIcon>
            </IconButton>
            <Typography variant="h6" style={this.styles.title}>
              速报观察
            </Typography>
            <IconButton edge="start" color="inherit" onClick={() => {
              this.setState((pre) => {
                return {
                  muiChoise: !pre.muiChoise
                }
              })
            }}>
              <PlaylistAddIcon></PlaylistAddIcon>
            </IconButton>
            <IconButton edge="start" color="inherit" onClick={() => {
              // 刷新
              window.location.reload();
            }}>
              <RefreshIcon></RefreshIcon>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* 一个AppBar高度 */}
        <div style={{marginTop: 64 + 'px'}}></div>

        <div className="container-main">
          <Container className="thread">
            {empty}
            <br />
            {threads}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                aria-label="Expand"
                id="panel1a-header"
              >
                <div>
                  <Typography style={this.styles.heading} color='primary'>致闻</Typography>
                  <Button aria-label="Acknowledge" color="primary"
                    onClick={(event) => {
                      event.stopPropagation()
                      this.addOldThreads()
                    }}
                    onFocus={(event) => event.stopPropagation()}>把上面所有串加入致闻</Button>
                  <Button aria-label="Acknowledge" color="primary"
                    onClick={(event) => {
                      event.stopPropagation()
                      this.addChosedOldThreads()
                    }}
                    onFocus={(event) => event.stopPropagation()}
                    style={{ display: this.state.muiChoise ? "block" : "none" }}>将勾选串加入致闻</Button>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Container>
                  {oldThreads}
                </Container>
              </AccordionDetails>
            </Accordion>
          </Container>
        </div>
        <ScrollTop {...this.props}>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </div>
    );
  }
}


