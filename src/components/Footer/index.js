import Taro, { Component } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { AtCard } from "taro-ui";
import './index.styl'

export default class Footer extends Component {
  render() {
    return (
      <div class="SeuFooter">
        Copyright© 2019 中国 南京<br/>
        东南大学 图书馆 苏ICP备-06006239
      </div>
    );
  }
}
