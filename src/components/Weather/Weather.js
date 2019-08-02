import Taro, { Component } from "@tarojs/taro";
import { Text,Label, View } from "@tarojs/components";
import { AtCard } from "taro-ui";
import './Weather.styl';
import RestTools from "../../utils/RestTools";

export default class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      location: "",
      time:"",
      cond_txt:"",
      tmp:"",
      wind_sc:"",
      wind_dir:"",
      fl:""
    };
  }

  componentWillMount() {
    RestTools.httpRequest(
      "/now",
      "GET",
      {
        key:'2502052d9d4f41878b85fa75635be718',
        tdsourcetag:'s_pcqq_aiomsg',
        location: this.state.data
      },
      false,false,true
    )
      .then(res => {
        const now = res["HeWeather6"][0]["now"];
        this.setState({
          location:res["HeWeather6"][0]["basic"]["location"],
          time: res["HeWeather6"][0]["update"]["loc"],
          cond_txt:now["cond_txt"],
          tmp:now["tmp"]+"°C",
          fl:now["fl"]+"°C",
          wind_sc:now["wind_sc"]+"级",
          wind_dir:now["wind_dir"]
        });
      })
      .catch(res => {
        console.log(res);
      });  
  }

  render() {
    return (
      <View className="Weather">
        <p>
          <Label>地点：&nbsp;&nbsp;</Label>
          <Text>{this.state.location}</Text>
        </p>
        <p>
          <Label>时间：&nbsp;&nbsp;</Label>
          <Text>{this.state.time}</Text>
        </p>
        <p>
          <Label>天气：&nbsp;&nbsp;</Label>
          <Text>{this.state.cond_txt}</Text>
        </p>
        <p>
          <Label>温度：&nbsp;&nbsp;</Label>
          <Text>{this.state.tmp}</Text>
        </p>
        <p>
          <Label>体感：&nbsp;&nbsp;</Label>
          <Text>{this.state.fl}</Text>
        </p>
        <p>
          <Label>风力：&nbsp;&nbsp;</Label>
          <Text>{this.state.wind_sc}</Text>
        </p>
        <p>
          <Label>风向：&nbsp;&nbsp;</Label>
          <Text>{this.state.wind_dir}</Text>
        </p>
      </View>
    );
  }
}
