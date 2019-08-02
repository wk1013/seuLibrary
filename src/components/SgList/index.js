import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText, Navigator } from "@tarojs/components";
import _ from "lodash";
import RestTools from "../../utils/RestTools";
import "./index.styl";

export default class SgList extends Component {
  constructor(props) {
    super(props);
    this.setState({
      data: null,
      isOpened: false
    });
  }

  componentWillMount() {
    this.setState({
      data: this.props.data
    });
  }

  handleClick = item => {
    this.props.onShowLayout({
      floatTitle: item.Data.title,
      floatContent: item.Data.answer + item.Data.answer_context,
      showLayout: true
    });
  };

  render() {
    const { data = null } = this.state;

    return (
      <View>
        {data &&
          data.map(item => {
            const sg = item.Data;
            const url =
              sg.source_type === "期刊" &&
              RestTools.webViewUrl.journal + `${sg.source_id}.html`;
            return (
              <View className='literature_listItem' key={sg.ID}>
                <View className='bottom'>
                  <View className='b-center'>
                    <View className='title'>
                      <RichText
                        onClick={this.handleClick.bind(this, item)}
                        className='content'
                        nodes={RestTools.translteToRed(
                          _.get(sg, "answer", "-")
                        )}
                      />
                    </View>
                    <View className='department info'>
                      <Text>
                        来自：
                        <Navigator className="link" url={url} hover-class="navigator-hover" open-type="navigate">
                          {_.get(sg, "title", "-")}
                        </Navigator>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
      </View>
    );
  }
}
