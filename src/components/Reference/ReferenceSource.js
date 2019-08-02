import Taro, { Component } from "@tarojs/taro";
import { View, Text,Image } from "@tarojs/components";
import "./ReferenceSource.styl";
import rSourceIcon from "../../statics/rsource.png";
import RestTools from "../../utils/RestTools";

export default class ReferenceSource extends Component {
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
        <Image src={rSourceIcon}></Image>
        <Text className="referenceHeader">{RestTools.removeRed(data)}</Text>
      </View>
    );
  }
}
