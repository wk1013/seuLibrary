import Taro, { Component } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { AtCard } from "taro-ui";
import './index.styl'

export default class AppBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      thumb: props.thumb,
      data: props.data || []
    };
  }
  handleClick = m => {
    // console.log("target", m);
    this.props.onClickItem(m);
  };
  render() {
    const { title, thumb, data } = this.state;
    return (
      <AtCard className='atCard' title={title} thumb={thumb}>
        {data.map((item) => {
          return (
            <View className='item' key={item.id}>
              <Text onClick={this.handleClick.bind(this,item)}>{item.title}</Text>
            </View>
          );
        })}
      </AtCard>
    );
  }
}
