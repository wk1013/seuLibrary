import Taro, { Component } from "@tarojs/taro";
import { View,Button } from "@tarojs/components";
import "./Reference.styl";
import ReferenceTitle from "./ReferenceTitle";
import ReferenceContent from "./ReferenceContent";
import ReferenceSource from "./ReferenceSource";

export default class Reference extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:props.data,
      index:props.index
    }
  }

  render() {
    const { data, index } = this.state;
    return (
      <View className="reference">
        <ReferenceTitle data={data["DATA"][0]["FieldValue"]["Title"]} />
        <ReferenceContent data={data["DATA"][0]["FieldValue"]["Answer"]} index={index} />
        {/* <ReferenceSource data={data["DATA"][0]["FieldValue"]["工具书名称"]} /> */}
      </View>
    );
  }
}
