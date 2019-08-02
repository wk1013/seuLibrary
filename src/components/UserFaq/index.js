import Taro, { Component } from "@tarojs/taro";
import { View, RichText} from "@tarojs/components";
import _ from "lodash";
import RestTools from '../../utils/RestTools'
import './index.styl'

class UserFaq extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const data = this.props.data;
    let source = null;
    return (
      <View className='business'>
        <RichText nodes={RestTools.lineFeed(RestTools.translteToRed(_.get(data, "Answer", "")))} />
      </View>
    );
  }
}

export default UserFaq;
