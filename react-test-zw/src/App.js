import React, { Component } from 'react';
import { fetchRandomData, detailsdata } from './services';
import './index.css';
import {
  HashRouter,
  Route,
  Link,
  Switch,
  Redirect
}   from 'react-router-dom';

class Nav extends Component{

  render(){
    return (
      <HashRouter>
      <Switch>
        <Route path="/list" component={App}/>
        <Route path={`/other/:id`} component={Detailha}/>
        <Redirect from="/" to="/list" />
      </Switch>
      </HashRouter>
    )
  }
}

class Detailha extends Component{

  constructor(props){
    super(props);
    this.state = {
      contents: []
    }; 
  }

  componentDidMount() {
    this.detailData();
  }

  detailData = () => {  
    detailsdata(this.props.match.params.id).then((res) =>{
      this.setState({
        contents: res.data
      })
    })
  }

  render() {
    let { goBack } = this.props.history;
    return (
      <div>
        <button onClick={goBack}>返回首页</button>
        <div dangerouslySetInnerHTML={{__html:this.state.contents.content}}></div>
      </div>   
    );
  }
}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
        indexList:[],//当前渲染的页面数据
        data: [],//所有数据
        current: 1, //当前页码
        pageSize:10, //每页显示的条数
        goValue:0,  //要去的条数index
        totalPage:0,//总页数
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetchRandomData().then((res) =>{
      this.setState({
        data: res.data
      })
      //设置总页数
      this.setState({
        totalPage:Math.ceil( this.state.data.length/this.state.pageSize)
      })
      this.pageNext(this.state.goValue)
    })    
  }

  //设置内容
  setPage=(num)=>{
    this.setState({
      indexList:this.state.data.slice(num,num+this.state.pageSize)
    })
  }
  
  pageNext=(num)=>{
    this.setPage(num)
  }

  render() {
    const {indexList}=this.state
    return ( 
      <HashRouter>
        <div className="list">
        <div>
          <ul>{indexList.map((content,index)=>{return(<li key={index}><Link to={`/other/${content.id}`}>{content.title}</Link></li>)})}</ul>
          <PageButton { ...this.state } pageNext={this.pageNext} /></div>
        </div>
      </HashRouter>               
    );
  }
}

class PageButton extends Component {

  constructor(props) {
      super(props);
      this.state={
          num: 0,
          pagenum:this.props.current
      }
  }

  //下一页
  setNext=()=>{
      if(this.state.pagenum < this.props.totalPage){
          this.setState({
              num:this.state.num + this.props.pageSize,
              pagenum:this.state.pagenum + 1
          },function () {
              console.log(this.state)
              this.props.pageNext(this.state.num)
          })
      }
  }

  //上一页
  setUp=()=>{
      if(this.state.pagenum > 1){
          this.setState({
              num:this.state.num - this.props.pageSize,
              pagenum:this.state.pagenum - 1
          },function () {
              console.log(this.state)
              this.props.pageNext(this.state.num)
          })
      }
  }

  render() {
      return (
          <div className="change_page">
              <span onClick={ this.setUp } >上一页</span>
              <span>{ this.state.pagenum }页/ { this.props.totalPage }页</span>
              <span onClick={ this.setNext }>下一页</span>
          </div>
      );
  }
}

export default Nav;