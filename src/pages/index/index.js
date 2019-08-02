import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView, Text, Icon } from "@tarojs/components";
import { AtFab, AtToast } from "taro-ui";
import SearchPanel from "../../components/SearchPanel";
import AppBlock from "../../components/AppBlock";
import "./index.styl";
import mockData from "../../mock/mockData.json";
import Footer from "../../components/Footer";
import RestTools from "../../utils/RestTools";
import voiceRecording from "../../statics/voice-recording.gif"

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      searchValue: "",
      showVoice: false,
      isOpened: false,
			array:JSON.parse(localStorage.getItem('History')) || []
    };
  }

  componentDidMount() {
    const loactionUrl = window.location.href;
    RestTools.getSignatureFromServer(loactionUrl);
    window.wx.ready(function() {
      window.wx.checkJsApi({
        jsApiList: [
          "startRecord",
          "stopRecord",
          "onVoiceRecordEnd",
          "translateVoice"
        ],
        success: function() {
          console.log("check success");
        }
      });
    });
    // window.wx.error(function() {
    //   const url = window.location.href.split("#")[0];
    //   RestTools.getSignatureFromServer(url);
    // });
  }

  componentWillUnmount() {}

  componentDidShow() {
    this.setState({
      searchValue: ""
    });
  }

  componentDidShow() {
  
  }

  handleClickItem = value => {
    this.setState(
      {
        searchValue: value.title
      },
      () => {
        this.handleSearch(value.title);
      }
    );
  };


  handleSearch = value => {
    this.setState({
      searchValue: value
    })
    // 跳转到目的页面，打开新页面
		this.state.array=JSON.parse(localStorage.getItem('History'))||[];
		this.state.array.unshift(value);
		for(var i=0;i<this.state.array.length;i++){
			for(var j=i+1;j<this.state.array.length;j++){
				if(this.state.array[i]===this.state.array[j]){
					this.state.array.splice(j,1);
					i--;
				}
			}
		}
		if(this.state.array.length>10){
			this.state.array.pop();
		}
		localStorage.setItem("History",JSON.stringify(this.state.array));
    Taro.navigateTo({ url: `../result/index?q=${encodeURIComponent(value)}` });
  };

  handleTouchStart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      isOpened: true,
    })
    window.wx.startRecord();
  };

  handleRecord = () => {
    let that = this;
    window.wx.stopRecord({
      success: function(response) {
        let localId = response.localId;
        window.wx.translateVoice({
          localId: localId,
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function(res) {
            if (!res.translateResult) {
              Taro.showToast({title:"哎呀没听清楚呢，请刷新页面再试",icon:'none'});
            }
            let result = res.translateResult;
            //去掉最后一个句号
            result = result.substring(0, result.length - 1);
            that.setState({
              searchValue: result
            },()=>{
              that.handleSearch(result)
            });
          }
        });
      },
      fail: function() {
        Taro.showToast({title:"哎呀没听清楚呢，请刷新页面再试",icon: 'none'});
      }
    });
  };

  handleTouchCancel = (e) => {
    e.preventDefault()
    this.setState({
      isOpened: false
    })
    this.handleRecord();
  };

  handleTouchEnd = (e) => {
    e.preventDefault()
    this.setState({
      isOpened: false
    })    
    this.handleRecord();
  };

  switchMic =() => {
    const showVoice = this.state.showVoice;
    this.setState({
      showVoice: !showVoice
    })
  }

  render() {
    const { searchValue, showVoice, isOpened } = this.state;
    return (
      <View className='index'>
        <View className='top'>
          <SearchPanel
            searchValue={searchValue}
            onSearch={this.handleSearch.bind(this)}
          />
          <Icon  className='micSwitch iconfont icon-microphone' onClick={this.switchMic.bind(this)}></Icon>
        </View>

        <ScrollView className='bottom'>
          <View className='at-row at-row__justify--around'>
            <View className='at-col-5 tipBlock' style="border-top:medium solid #49ccff;border-radius:0.3rem">
              <AppBlock
                title='业务咨询'
                data={mockData.business}
                onClickItem={this.handleClickItem.bind(this)}
              />
            </View>
            <View className='at-col-5 tipBlock' style="border-top:medium solid #ffbc42;border-radius:0.3rem">
              <AppBlock
                title='馆藏咨询'
                data={mockData.storage}
                onClickItem={this.handleClickItem.bind(this)}
              />
            </View>
          </View>

          <View className='at-row at-row__justify--around'>
            <View className='at-col-5 tipBlock' style="border-top:medium solid #ad60ff;border-radius:0.3rem">
              <AppBlock
                title='文献咨询'
                data={mockData.literature}
                onClickItem={this.handleClickItem.bind(this)}
              />
            </View>
            <View className='at-col-5 tipBlock' style="border-top:medium solid #ff8787;border-radius:0.3rem">
              <AppBlock
                title='知识问答'
                data={mockData.knowledge}
                onClickItem={this.handleClickItem.bind(this)}
              />
            </View>
          </View>

          <View className='at-row at-row__justify--around'>
            <View className='at-col-5 tipBlock' style="border-top:medium solid #a8ffcc;border-radius:0.3rem">
              <AppBlock
                title='业务办理'
                data={mockData.handleOl}
                onClickItem={this.handleClickItem.bind(this)}
              />
            </View>
            <View className='at-col-5 tipBlock' style="border-top:medium solid #ff8fc6;border-radius:0.3rem">
              <AppBlock
                title='资讯讲座'
                data={mockData.news}
                onClickItem={this.handleClickItem.bind(this)}
              />
            </View>
          </View>

        </ScrollView>

        <Footer></Footer>

        {showVoice && (
          <Text
            onTouchStart={this.handleTouchStart.bind(this)}
            onTouchCancel={this.handleTouchCancel.bind(this)}
            onTouchEnd={this.handleTouchEnd.bind(this)}
          >
            <AtFab size='normal' ref={this.refAtFab}>
              <Icon className='iconfont icon-microphone' />
            </AtFab>
          </Text>
        )}
        <AtToast isOpened={isOpened} duration={0} text='正在聆听...' image={voiceRecording}></AtToast>
      </View>
    );
  }
}
