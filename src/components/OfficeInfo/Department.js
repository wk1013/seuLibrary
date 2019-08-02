import Taro, { Component } from "@tarojs/taro";
import { View,Label,Text } from "@tarojs/components";
import "./OfficeInfo.styl";
import { AtModal, AtToast, AtModalContent, AtModalAction,AtInput  } from "taro-ui"
import RestTools from "../../utils/RestTools"

export default class OfficeInfoWithoutImage extends Component {
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
          <Label>校区：</Label>
          <Text>{data["校区"]}</Text>
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
