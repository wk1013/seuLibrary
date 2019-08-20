import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, RichText } from "@tarojs/components";
import { AtPagination } from "taro-ui";
import _ from "lodash";
import RestTools from "../../utils/RestTools";
import "./book.styl";
import bookPng from "../../statics/book.png";

export default class BookList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      data: this.props.data,
      page: this.props.page
    });
  }

  handleClick = item => {
    RestTools.httpRequest(
      "/GetBookRetrInfo",
      "GET",
      {
        bookrecno: item.ID
      },
      false,
      true
    ).then(res => {
      if (res.success) {
        this.props.onShowLibraryStorage(res.Books);
      }
    });
  };

  handlePageChange = item => {
    this.props.onGetDataByPage(item.current, this.state.data, "book");
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
    const mark = data.mark;
    return (
      <View>
        {finalData && finalData[0].hasOwnProperty("__Answer__") ? (
          <View style={{ width: '90%', margin: '10px auto', borderRadius: '10px', background: '#FFF' }}>
            {finalData.map((item, index) => {
              return (
                <View
                  style={{
                    fontSize: "14px",
                    padding: "10px 30px",
                    color: "#333"
                  }}
                  key={index}
                >
                  {item.__Answer__}
                </View>
              );
            })}
          </View>
        ) : (
            finalData.map(item => {
              const book = item;
              return (
                <View
                  className='book_listItem'
                  key={book.ID}
                  onClick={this.handleClick.bind(this, item)}
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
                        <RichText
                          className='richtext'
                          nodes={
                            RestTools.translteToRed(_.get(book, "出版社", "-")) +
                            "/" +
                            RestTools.translteToRed(
                              _.get(book, "出版时间", "-")
                            ) +
                            "/" +
                            RestTools.translteToRed(_.get(book, "作品语种", "-"))
                          }
                        />
                      </View>
                      <View className='author info'>
                        <Text>
                          {RestTools.translteToRed(_.get(book, "作者_显示", "-"))}
                        </Text>
                      </View>
                      <View className='bookIndex info'>
                        <Text>
                          馆藏地：
                        <RichText
                            className='richtext'
                            nodes={_.get(book, "local", "-")}
                          />
                        </Text>
                      </View>
                      <View className='storage info'>
                        <Text
                          style={{
                            display: "inline-block",
                            marginRight: "20px",
                            color: mark === "馆藏复本" ? "red" : "#a4a4a4"
                          }}
                        >
                          馆藏复本：{_.get(book, "compnum", 0)}
                        </Text>
                        <Text style={{ color: mark === "在馆数" ? "red" : "#a4a4a4" }}>在馆数：{_.get(book, "hldallnum", 0)}</Text>
                      </View>
                    </View>
                    <View className='b-right'>
                      <View className='at-icon at-icon-chevron-right' />
                    </View>
                  </View>
                </View>
              );
            })
          )}
        {finalData && !finalData[0].hasOwnProperty("__Answer__") ? (
          <AtPagination
            total={_.get(page, "Total")}
            pageSize={
              page.PageCount == undefined ||
                page.PageCount == null ||
                page.PageCount == 0
                ? 5
                : page.PageCount
            }
            current={_.get(page, "PageNum") || 1}
            icon
            onPageChange={this.handlePageChange.bind(this)}
          />
        ) : null}
      </View>
    );
  }
}
