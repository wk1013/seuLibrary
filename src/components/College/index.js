import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, RichText } from "@tarojs/components";
import { AtPagination, AtAccordion } from "taro-ui";
import _ from "lodash";
import RestTools from "../../utils/RestTools";
import "./index.styl";

export default class College extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  let data = this.props.data;
  let {KNode, ...others} = data;
  KNode = KNode.map(item => {return {...item,open: false}})
    this.setState({
      data: {KNode, ...others},
      page: this.props.page,
    });
  }

  handlePageChange = item => {
    this.props.onGetDataByPage(item.current, this.state.data);
  };

  handleClick = (item,index) => {
    let data = this.state.data;
    let {open,...others} = item;
    data.KNode[index] = {...others, open: !open};
    this.setState({
      data: data
    })
    
  }

  render() {
    const {data=null,page} = this.state;
    return (
      <View>
        {data &&
          data.KNode.map((item,index) => {
            const college = item.DATA[0].FieldValue;
            return (
              <View
                className='college_listItem'
                key={college.ID}
                // onClick={this.handleClick.bind(this, item)}
              >
                <View className='top at-row at-row__justify--around'>
                  <View className='b-left at-col-4'>
                    <Image
                      src={_.get(college, "图片", RestTools.defaultUrl)}
                      className='img'
                    />
                  </View>

                  <View className='b-center at-col-6'>
                    <View className='author info'>
                      <RichText
                        className='collegeName'
                        nodes={RestTools.translteToRed(
                          _.get(college, "学院名", "-")
                        )}
                      />
                    </View>

                    <View className='statics info'>
                      <View className='at-row at-row--wrap'>
                        <View className='at-col-6'>
                          <Text>{_.get(college, "成果总量", "-")}</Text>
                          <View className='tip'>成果总量</View>
                        </View>
                        <View className='at-col-6'>
                          <Text>{_.get(college, "学者", "-")}</Text>
                          <View className='tip'>学者</View>
                        </View>
                        <View className='at-col-6'>
                          <Text>{_.get(college, "被引频次", "-")}</Text>
                          <View className='tip'>被引频次</View>
                        </View>
                        <View className='at-col-6'>
                          <Text>{_.get(college, "H指数", "-")}</Text>
                          <View className='tip'>H指数</View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View className='bottom'>
                  <AtAccordion 
                    open={item.open}
                    isAnimation={false}
                    onClick={this.handleClick.bind(this,item,index)}
                    title='院系简介：'
                  >
                    <Text className='simpleDesc'>
                    {_.get(college, "院系简介", "")}
                  </Text>
                  
                  </AtAccordion>
                
                </View>
              </View>
            );
          })}

        {page.PageCount < page.Total ? (
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
