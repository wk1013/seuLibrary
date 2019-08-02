import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, RichText } from "@tarojs/components";
import { AtPagination } from "taro-ui";
import _ from "lodash";
import RestTools from "../../utils/RestTools";
import "./index.styl";

export default class Scholar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    this.setState({
      data: this.props.data,
      page: this.props.page
    })
  }

  handlePageChange = item => {
    this.props.onGetDataByPage(item.current, this.state.data);
  };

  render() {
    const {data=null,page} = this.state;  
    return (
      <View>
        {data &&
          data.KNode.map(item => {
            const scholar = item.DATA[0].FieldValue;
            return (
              <View
                className='scholar_listItem'
                key={scholar.ID}
                // onClick={this.handleClick.bind(this, item)}
              >
                <View className='bottom at-row'>
                  <View className='b-left at-col-4'>
                    <Image
                      src={_.get(scholar,'头像',RestTools.defaultUrl)}
                      className='img'
                    />
                  </View>

                  <View className='b-center at-col-8'>
                    <View className='info'>
                      <Text>
                        <RichText className='name' nodes={RestTools.translteToRed(_.get(scholar, "学者名", "-"))} />
                        <RichText nodes={RestTools.translteToRed(_.get(scholar, "学者职称", "-"))} />
                      </Text>
                    </View>
                    <View className='department info'>
                      <Text>院系：<RichText className='richText'  nodes={RestTools.translteToRed(_.get(scholar, "学者单位", "-"))} /></Text>
                    </View>
                    <View className='position info'>
                      <Text>职务：<RichText className='richText'  nodes={RestTools.translteToRed(_.get(scholar, "职务", "-"))} /></Text>
                    </View>
                    <View className='tech_title info'>
                      <Text>学术头衔：<RichText className='richText' nodes={RestTools.translteToRed(_.get(scholar, "学术头衔", "-"))} /></Text>
                    </View>
                    <View className='study_target info'>
                      <Text>研究方向：<RichText className='richText' nodes={RestTools.translteToRed(_.get(scholar, "研究方向", "-"))} /></Text>
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
