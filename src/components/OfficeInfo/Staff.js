import Taro, { Component } from "@tarojs/taro";
import { View,Label,Text } from "@tarojs/components";
import "./OfficeInfo.styl";
import { AtModal, AtToast, AtModalContent, AtModalAction,AtInput  } from "taro-ui"
import RestTools from "../../utils/RestTools"

export default class OfficeInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:props.data
    }
  }

  render() {
    const data = this.state.data;

    return(
      <View className="OfficeBody">
        <p>
          <Label>职务：</Label>
          <Text>{RestTools.removeRed(data["职务"])}</Text>
        </p>
        <p>
          <Label>地址：</Label>
          <Text>{data["地址"]}</Text>
        </p>
        <p>
          <Label>电话：</Label>
          <Text>{data["电话"]}</Text>
        </p>
      </View>
    );
  }
}
