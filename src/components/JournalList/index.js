import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, RichText } from '@tarojs/components'
import { AtPagination } from 'taro-ui'
import _ from 'lodash'
import RestTools from '../../utils/RestTools'
import './index.styl'
import bookPng from '../../statics/book.png'

export default class JournalList extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.setState({
      data: this.props.data,
      page: this.props.page
    })
  }

  handlePageChange = item => {
    this.props.onGetDataByPage(item.current, this.state.data, 'book')
  }

  render() {
    const { data, page } = this.state
    const newData = data.KNode.map(item => {
      return item.DATA.map(v => v.FieldValue)
    })
    const finalData = _.flatten(newData)
    return (
      <View>
        {finalData && finalData[0].hasOwnProperty('__Answer__') ? (
          <View
            style={{
              width: '90%',
              margin: '10px auto',
              borderRadius: '10px',
              background: '#FFF'
            }}
          >
            {finalData.map((item, index) => {
              return (
                <View
                  style={{
                    fontSize: '14px',
                    padding: '10px 30px',
                    color: '#333'
                  }}
                  key={index}
                >
                  {item.__Answer__}
                </View>
              )
            })}
          </View>
        ) : (
          finalData.map(item => {
            const book = item
            return (
              <View
                className='book_listItem'
                key={book.ID}
                // onClick={this.handleClick.bind(this, item)}
                style='margin:12px 9px;box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);'
              >
                <View className='top'>
                  <Text>
                    <RichText
                      nodes={RestTools.translteToRed(_.get(book, '主题', ''))}
                    />
                  </Text>
                </View>

                <View className='bottom'>
                  <View className='b-left'>
                    <Image src={bookPng} className='img' />
                  </View>

                  <View className='b-center'>
                    <View className='author info'>
                      <Text>主办单位：</Text>
                      <RichText
                        className='richtext'
                        nodes={RestTools.translteToRed(
                          _.get(book, '主办单位名称', '-')
                        )}
                      />
                    </View>

                    <View className='author info'>
                      <Text>ISSN：</Text>
                      <RichText
                        className='richtext'
                        nodes={RestTools.translteToRed(
                          _.get(book, 'ISSN', '-')
                        )}
                      />
                    </View>

                    <View className='author info'>
                      <Text>CN：</Text>
                      <RichText
                        className='richtext'
                        nodes={RestTools.translteToRed(_.get(book, 'CN', '-'))}
                      />
                    </View>
                    <View className='author info'>
                    <Text>综合影响因子：</Text>
                      <Text>
                        {RestTools.translteToRed(
                          _.get(book, '综合影响因子', '-')
                        )}
                      </Text>
                    </View>
                    <View className='bookIndex info'>
                    <Text>复合影响因子：</Text>
                      <Text>
                        <RichText
                          className='richtext'
                          nodes={_.get(book, '复合影响因子', '-')}
                        />
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          })
        )}
        {finalData && !finalData[0].hasOwnProperty('__Answer__') ? (
          <AtPagination
            total={_.get(page, 'Total')}
            pageSize={
              page.PageCount == undefined ||
              page.PageCount == null ||
              page.PageCount == 0
                ? 5
                : page.PageCount
            }
            current={_.get(page, 'PageNum') || 1}
            icon
            onPageChange={this.handlePageChange.bind(this)}
          />
        ) : null}
      </View>
    )
  }
}
