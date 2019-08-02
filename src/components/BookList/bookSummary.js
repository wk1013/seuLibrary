import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, RichText } from "@tarojs/components";
import { AtPagination } from "taro-ui";
import _ from "lodash";
import RestTools from "../../utils/RestTools";
import "./bookSummary.styl";
import bookPng from "../../statics/book.png";

export default class BookSummary extends Component {
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
    this.props.onGetDataByPage(item.current, this.state.data, "bookSummary");
  };

  updateState = () => {
    this.setState({
      data: this.props.data,
      page: this.props.page
    });
  };

  render() {
    const { data, page } = this.state;
    const newData = data.KNode.map(item => {
      return item.DATA.map(v => v.FieldValue);
    });
    const finalData = _.flatten(newData);
    return (
      <View>
        {finalData &&
         finalData.map(item => {
        
              const book = item;
              return (
                <View
                  className='bookSummary_listItem'
                  key={book.ID}
                  // onClick={this.handleClick.bind(this, item)}
                  style='margin:12px 9px;box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);'
                >
                  <View className='top'>
                    <Text>
                      <RichText
                        nodes={RestTools.translteToRed(_.get(book, "题名", ""))}
                      />
                    </Text>
                  </View>

                  <View className='bottom'>
                    <View className='b-left'>
                      <Image src={bookPng} className='img' />
                    </View>

                    <View className='b-center'>
                      <View className='author info'>
                        <Text>
                          {book.作者}/{book.出版社}/{book.作品语种}
                        </Text>
                      </View>
                      <View className='bookIndex info'>
                        <Text>{book.摘要}</Text>
                      </View>
                    </View>
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
