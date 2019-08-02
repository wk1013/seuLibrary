import Taro, { Component } from "@tarojs/taro";
import { View,Button } from "@tarojs/components";
import "./ReferenceList.styl";
import Reference from "./Reference";

export default class ReferenceList extends Component {
  constructor(props){
    super(props);
    this.state = {
      list:props.data,
      index:props.id
    }
  }

  render() {
    const { list, index } = this.state;
    return (
      <View className="referenceList">
        <Reference
          data={list}
          index={index}
        />
      </View>
    );
  }
}
