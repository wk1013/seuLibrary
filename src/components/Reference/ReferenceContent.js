import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, RichText } from "@tarojs/components";
import "./ReferenceContent.styl";
import RestTools from "../../utils/RestTools";
import rContentIcon from "../../statics/rcontent.png"

export default class ReferenceContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      index: props.index,
      index_a: -1,
      open: false
    }
  }

  render() {
    const { data, open, index_a, index } = this.state;
    return (
      <View className="referenceContent">
        <Image src={rContentIcon}></Image>
        <Text className="referenceHeader">介绍</Text>
        <RichText
          className="referenceBody"
          nodes={RestTools.unifyFontColor(RestTools.fixImgSrc(RestTools.translteToRed(data.substring(0, 200))))}
          style={{
            display: open && index_a === index ? "none" : "block"
          }}
        ></RichText>

        <RichText
          className="referenceBody"
          nodes={RestTools.unifyFontColor(RestTools.fixImgSrc(RestTools.translteToRed(data)))}
          style={{
            display: open && index_a === index ? "block" : "none"
          }}
        ></RichText>

        {data.length > 200 ? (
          open && index_a === index ?
            <View
              className='more'
              onClick={() => {
                this.setState({ open: !this.state.open, index_a: index });
              }}
            >
              {"<<收回"}
            </View> : <View
              className='more'
              onClick={() => {
                this.setState({ open: !this.state.open, index_a: index });
              }}
            >
              {"查看更多>>"}
            </View>
        ) : null}
      </View>
    );
  }
}
