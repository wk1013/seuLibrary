import Taro, { Component } from '@tarojs/taro'
// 引入 WebView 组件
import { WebView } from '@tarojs/components'
// import RestTools from '../../utils/RestTools'

export default class index extends Component {
  constructor(props){
    super(props)
  }
  componentWillMount() {
    const {src} = this.$router.params;
    console.log(src)
    this.setState({
     src:src
    })
    window.open(src)
  }

  
  render () {
    // const src = this.state.src
    
    // return (
    //   src &&  <WebView src={src} />
    // )
  }
}