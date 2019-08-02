import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtModal, AtModalHeader, AtModalContent } from "taro-ui";
import _ from "lodash";
import "./libraryStorage.styl";

export default class LibraryStorage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   bookOpen: props.bookOpen,
    //   libraryStorage: props.libraryStorage
    // };
  }

  updateState = () => {
    this.setState({
      bookOpen: this.props.bookOpen,
      libraryStorage: this.props.libraryStorage
    });
  }

  render() {
    const { bookOpen, libraryStorage } = this.props;
    return (
      <AtModal isOpened={bookOpen} className='modal'>
        <AtModalHeader>馆藏详情</AtModalHeader>
        <AtModalContent>
          <View className='at-row'>
            <View className='at-col-4 title'>馆藏地</View>
            <View className='at-col-2 title'>状态</View>
            <View className='at-col-3 title'>索书号</View>
            <View className='at-col-3 title'>归还日期</View>
          </View>
          {libraryStorage.map(item => {
            return (
              <View key={item.id} className='at-row'>
                <View className='at-col-4 s-item loc'>{item.curlocal}</View>
                <View
                  className={
                    item.localstatus === "可借"
                      ? "at-col-2 s-item green"
                      : "at-col-2 s-item red"
                  }
                >
                  {
                    item.localstatus == null || item.localstatus.length == 0
                      ? "-"
                      : item.localstatus
                  }
                </View>
                <View className='at-col-3 s-item out'>
                  {_.get(item, "callno", "-")}
                </View>
                <View className='at-col-3 s-item back'>
                  {
                    item.returndate == null || item.returndate.length == 0
                      ? "-"
                      : item.returndate
                  }
                </View>
              </View>
            );
          })}
        </AtModalContent>
      </AtModal>
    );
  }
}
