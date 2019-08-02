import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

export default class LikeModule extends Taro.Component {
  render() {
    return (
      <View className='like-wrap'>
      <Text style={{marginRight: '20px'}}>
        <Icon
          className={
            User == "1" ? "iconfont icon-like active" : "iconfont icon-like"
          }
          onClick={this.props.onClickLike.bind(this, true)}
        />
        {Aye || 0}
      </Text>
      <Text>
        <Icon
          className={
            User == "0"
              ? "iconfont icon-dislike active"
              : "iconfont icon-dislike "
          }
          onClick={this.props.onClickLike.bind(this, false)}
        />
        {Nay || 0}
      </Text>
    </View>
      
    );
  }
}
