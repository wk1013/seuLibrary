import Taro, { Component } from "@tarojs/taro";
import { View,Button,Text } from "@tarojs/components";
import "./index.styl";
import { AtModal, AtToast, AtModalContent, AtModalAction,AtInput  } from "taro-ui"
import RestTools from "../../utils/RestTools"

export default class NoResult extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchValue : props.search,
      showDialog : false,
      Tip: "",
      showTip : false
    }
  }

  openDialog = () => {
    this.setState({
      showDialog:true,
      showTip:false
    });
  }

  updateQuestion = (value) => {
    this.setState({searchValue:value})
  }

  hideDialog = () =>{
    this.setState({showDialog:false});
  }

  submitQuestion = () =>{
    RestTools.httpRequest("/SetNewQ", "GET", {
      q: this.state.searchValue,
      type: "mobile"
    }).then(res => {
      if (res.Success) {
        this.setState({
          Tip:"问题 "+this.state.searchValue+" 提交成功",
          showTip : true,
          showDialog: false
        })
      }
      else {
        this.setState({
          Tip:"问题 "+this.state.searchValue+" 提交失败",
          showTip : true,
          showDialog: false
        })
      }
    }).catch(err => {
      this.setState({
        Tip:"问题 "+this.state.searchValue+" 提交失败",
        showTip : true,
        showDialog: false
      })
    });
  }

  render() {
    return (
      <View>
        <View className='msg'>
          您好，我暂时不能够回答您的问题<br/>
          如有需要，请点击<Text className="text" onClick={this.openDialog.bind(this)}>提交问题</Text><br/>
          图书馆老师稍后会为您解答
        </View>

        <AtModal isOpened={this.state.showDialog}>
            <AtModalContent>
              <AtInput
                name='submitValue'
                title='提交问题'
                type='text'
                value={this.state.searchValue}
                onChange={this.updateQuestion.bind(this)}
              />
            </AtModalContent>
          <AtModalAction>
            <Button onClick={this.hideDialog.bind(this)}>取消</Button>
            <Button onClick={this.submitQuestion.bind(this)}>确定</Button>
          </AtModalAction>
        </AtModal>

        <AtToast isOpened={this.state.showTip} text={this.state.Tip}></AtToast>
      </View>
    );
  }
}
