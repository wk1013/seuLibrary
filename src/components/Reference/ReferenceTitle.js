import Taro, { Component } from "@tarojs/taro";
import { View, Text,Image } from "@tarojs/components";
import "./ReferenceTitle.styl";
import rTitleIcon from "../../statics/rtitle.png" 
import RestTools from "../../utils/RestTools"

export default class ReferenceTitle extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:props.data
    }
  }

  render() {
    const { data } = this.state;
    return (
      <View>
        <Image src={rTitleIcon}></Image>
        <Text className="referenceHeader">{RestTools.removeRed(data)}</Text>
      </View>
    );
  }
}
