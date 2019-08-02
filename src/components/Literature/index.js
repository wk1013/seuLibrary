import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText } from "@tarojs/components";
import { AtPagination } from "taro-ui";
import _ from "lodash";
import RestTools from "../../utils/RestTools";
import "./index.styl";

export default class Literature extends Component {
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
    this.props.onGetDataByPage(item.current, this.state.data,"essay");
  };

  updateState = () =>{
    this.setState({
      data: this.props.data,
      page: this.props.page
    });
  }

  handleClick = item => {
    const { 来源数据库, 文件名, 学位授予单位代码 } = item;
    Taro.navigateTo({
      url: `../webView/index?sourceDb=${来源数据库}&fileName=${文件名}&code=${学位授予单位代码}`
    });
  };

  render() {
    const { data, page } = this.state;
    const newData = data.KNode.map(item => {
      return item.DATA.map(v => v.FieldValue)
    })
   const finalData = _.flatten(newData);
    return (
      <View>
        {finalData &&
          finalData.map(item => {
            const literature = item;
            const url =
              literature.来源数据库 === "期刊"
                ? RestTools.webViewUrl.journal + `${literature.文件名}.html`
                : RestTools.webViewUrl.dissertation +
                  `${literature.学位授予单位代码}-${literature.文件名}.html`;
            return (
              <View
                className='literature_listItem'
                key={literature.ID}
                style="margin:12px 9px;box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);"
              >
                <View className='bottom'>
                  <View className='b-center'>
                    <View className='title'>
                      <RichText
                        nodes={RestTools.addAtag(
                          url,
                          RestTools.translteToRed(
                            _.get(literature, "题名", "-")
                          )
                        )}
                      />

                      <RichText
                        className='descript'
                        nodes={
                          RestTools.translteToRed(
                            _.get(literature, "成果简介", "")
                          )
                        }
                      />

                    </View>
                    <View className='department info'>
                      <Text>
                        {literature.被引频次==undefined || literature.被引频次==null || literature.被引频次.length==0?"":("被引:"+literature.被引频次+"  ")}
                        {literature.来源数据库==undefined || literature.来源数据库==null || literature.来源数据库.length==0?"":(literature.来源数据库+"  ")}                     
                        <RichText 
                          className='richText' 
                          nodes={RestTools.translteToRed(literature.年==undefined || literature.年==null || literature.年.length==0?"":(literature.年+"  "))} 
                        />
                        <RichText 
                          className='richText' 
                          nodes={RestTools.translteToRed(literature.作者==undefined || literature.作者==null || literature.作者.length==0?"":(literature.作者+"  "))} 
                        />
                        <RichText 
                          className='richText' 
                          nodes={RestTools.translteToRed(literature.中文刊名==undefined || literature.中文刊名==null || literature.中文刊名.length==0?"":literature.中文刊名)} 
                        />
                      </Text>
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
