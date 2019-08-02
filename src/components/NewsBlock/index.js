import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText } from "@tarojs/components";
import { AtPagination } from "taro-ui";
import _ from "lodash";
import RestTools from "../../utils/RestTools";
import "./index.styl";

export default class NewsBlock extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      data: this.props.data,
      page: this.props.page
    });
  }

  handlePageChange = item => {
    this.props.onGetDataByPage(item.current, this.state.data,"news");
  };

  handleClick = item => {
    Taro.navigateTo({
      url: item.链接
    });
  };

  updateState = () =>{
    this.setState({
      data: this.props.data,
      page: this.props.page
    });
  }

  render() {
    const { data, page } = this.state;
    const newData = data.KNode.map(item => {
      return item.DATA.map(v => v.FieldValue)
    })
   const finalData = _.flatten(newData);
    return (
      <View className="newsList">
        {finalData &&
          finalData.map(item => {
            const news = item;
            const url = news.链接;
            return (
              <View
                className='newsItem'
                key={news.编号}
              >
                <View className='title'>
                  <RichText
                    nodes={RestTools.addAtag(
                      url,
                      RestTools.translteToRed(
                        _.get(news, "标题", "-")
                      )
                    )}
                  />
                </View>
                <View className='time'>
                  <Text>               
                    <RichText 
                      className='richText' 
                      nodes={news.发布时间} 
                    />
                  </Text>
                </View>
              </View>
            );
          })}

        {page.PageCount && page.PageCount < page.Total ? (
          <AtPagination
            total={_.get(page, "Total")}
            pageSize={_.get(page, "PageCount")}
            current={_.get(page, "PageNum") || 1}
            icon
            onPageChange={this.handlePageChange.bind(this)}
          />
        ) : null}
      </View>
    );
  }
}
