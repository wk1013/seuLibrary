import Taro, { Component } from "@tarojs/taro";
import { View,Button } from "@tarojs/components";
import "./OfficeInfo.styl";
import { AtModal, AtToast, AtModalContent, AtModalAction,AtInput  } from "taro-ui";
import Staff from "./Staff";
import Department from "./Department";
import RestTools from "../../utils/RestTools";

export default class OfficeInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:props.data
    }
  }

  render() {
    const data = this.state.data;
    let result = [];

    let title = "";
    if(data.intent_focus=="负责人"){
      title = RestTools.removeRed(data["KNode"][0]["DATA"][0]["FieldValue"]["负责人"]);
      data.KNode.map(item => {
        const fvs = item["DATA"][0]["FieldValue"];
        result.push(<Staff data={fvs}></Staff>)
      });
    }
    else if(data.intent_focus=="地址"){
      title = RestTools.removeRed(data["KNode"][0]["DATA"][0]["FieldValue"]["部门"]);
      data.KNode.map(item => {
        const fvs = item["DATA"][0]["FieldValue"];
        result.push(<Department data={fvs}></Department>)
      });
    }

    return(
      <View className="OfficeInfo">
        <View className="OfficeHeader">
          {title}
        </View>
        {result}
      </View>
    );
  }
}
