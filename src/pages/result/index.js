import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Icon, RichText } from '@tarojs/components'
import { AtActivityIndicator, AtFab, AtToast, AtFloatLayout } from 'taro-ui'
import _ from 'lodash'
import MultiSearch from '../../components/SearchPanel/MultiSearch'
import RestTools from '../../utils/RestTools'
import Book from '../../components/BookList/book' //图书类
import Business from '../../components/Business' //咨询类
import BookSummary from '../../components/BookList/bookSummary' //图书摘要类
import College from '../../components/College' //学校类
import Scholar from '../../components/Scholar' //学者类
import Literature from '../../components/Literature' //文献类
import BookSame from '../../components/BookList/bookSame'
import SgList from '../../components/SgList' //句群组件
import NoResult from '../../components/NoResult' //缺省页
import Relativity from '../../components/Relativity'
import Footer from '../../components/Footer'
import NewsBlock from '../../components/NewsBlock'
import voiceRecording from '../../statics/voice-recording.gif'
import ReferenceList from '../../components/Reference/ReferenceList'
import OfficeInfo from '../../components/OfficeInfo/OfficeInfo'
import Weather from '../../components/Weather/Weather'
import LibraryStorage from '../../components/LibraryStorage/LibraryStorage'
import UserFaq from '../../components/UserFaq'
import JournalList from '../../components/JournalList'
import './index.styl'

function sendMsg(q) {
  NameSpace.keyword.execq(q)
}

let timer = null;

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      guid: null,
      User: '',
      Aye: 0,
      Nay: 0,
      data: null,
      sg: false,
      loading: true,
      showVoice: false,
      isOpened: false,
      bookOpen: false,
      libraryStorage: [],
      floatContent: null,
      floatTitle: null,
      showLayout: false
    }
  }

  componentWillMount() {
    const guid = this.state.guid
    const question =
      this.state.searchValue || decodeURIComponent(this.$router.params.q) //解码参数，浏览器会编码
    sendMsg(question)
    this.setState(
      {
        searchValue: question
      },
      () => {
        this.handleSearch(question)
      }
    )
    if (guid) {
      this.getLikeCount()
    } else {
      let newGuid = RestTools.GetGUID()
      this.setState(
        {
          guid: newGuid
        },
        () => {
          this.getLikeCount()
        }
      )
    }
  }

  //获取点赞数
  getLikeCount = () => {
    const { searchValue, guid } = this.state
    RestTools.httpRequest('/GetLike', 'GET', {
      Content: searchValue,
      user: guid
    })
      .then(res => {
        this.setState({
          User: res.User,
          Aye: res.Aye,
          Nay: res.Nay
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  //点赞事件
  sendLike = like => {
    clearTimeout(timer); //防抖
    timer = setTimeout(() => {
      this.likeOrCollect(like);
    }, 300);
  }

  likeOrCollect = like => {
    let { User, guid, Aye, Nay, searchValue } = this.state
    if (User === '') {
      if (like) {
        Aye += 1
      } else {
        Nay += 1
      }
      this.setState({
        Aye: Aye,
        Nay: Nay,
        User: like ? '1' : '0'
      }, () => {
        Taro.request({
          url:
            RestTools.serverUrl +
            `/SendLike?user=${guid}&like=${like}&type=mobile&Content=${searchValue}`,
          method: 'POST',
          header: {
            'Access-Control-Allow-Origin': '*'
          }
        })
          .then(res => {
            if (res.data.Success) {
              console.log("点赞成功")
            } else {
              Taro.showToast({ title: '出了点小问题~，请稍后再试' })
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
    } else if ((User == '1' && like) || (User == '0' && !like)) {
      this.cancleLike(like)
    } else {
      Taro.showToast({ title: '您已经点过赞或反对过，如需继续请先取消之前的评价', icon: 'none' })
      return
    }
  }

  //取消点赞
  cancleLike = like => {
    let { searchValue, guid, Aye, Nay } = this.state;
    like ? (Aye -= 1) : (Nay -= 1)
    this.setState({
      User: '',
      Aye: Aye,
      Nay: Nay
    }, () => {
      Taro.request({
        url:
          RestTools.serverUrl +
          `/CancelLike?user=${guid}&Content=${searchValue}&type=mobile`,
        method: 'POST'
      })
        .then(res => {
          if (res.data.Success) {

          } else {
            Taro.showToast({ title: '出了点小问题~，请稍后再试' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  componentDidMount() {
    const loactionUrl = window.location.href.split('#')[0]
    RestTools.getSignatureFromServer(loactionUrl)
    window.wx.ready(function () {
      window.wx.checkJsApi({
        jsApiList: [
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'translateVoice'
        ],
        success: function () { }
      })
    })
    // window.wx.error(function() {
    //   const url = window.location.href.split("#")[0];
    //   RestTools.getSignatureFromServer(url);
    // });
  }

  handleTouchStart = e => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      isOpened: true,
      bookOpen: false
    })
    window.wx.startRecord()
  }

  handleRecord = () => {
    let that = this
    window.wx.stopRecord({
      success: function (response) {
        let localId = response.localId
        window.wx.translateVoice({
          localId: localId,
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            if (!res.translateResult) {
              Taro.showToast({
                title: '哎呀没听清楚呢，请刷新页面再试',
                icon: 'none'
              })
            }
            let result = res.translateResult
            //去掉最后一个句号
            result = result.substring(0, result.length - 1)
            that.setState(
              {
                searchValue: result
                // data:null
              },
              () => {
                // that.handleSearch(result);
                Taro.redirectTo({
                  url: `../../pages/result/index?q=${encodeURIComponent(
                    result
                  )}`
                })
              }
            )
          }
        })
      },
      fail: function () {
        Taro.showToast({
          title: '哎呀没听清楚呢，请刷新页面再试',
          icon: 'none'
        })
      }
    })
  }

  handleTouchCancel = e => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      isOpened: false
    })
    this.handleRecord()
  }

  handleTouchEnd = e => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      isOpened: false
    })
    this.handleRecord()
  }

  //获取馆藏信息
  getLibraryStorage = str => {
    RestTools.httpRequest(
      '/GetLocalInfo',
      'GET',
      {
        bookrecnos: str
      },
      false,
      true
    ) //第四个参数是句群APIurl,第五个参数是获取图书馆藏详情的API
      .then(res => {
        let data = this.state.data.filter(item => item.DataType === 3)
        data.map(item => {
          item.Data.KNode.map(v => {
            v.DATA.map(val => {
              const current = val.FieldValue //当前书本对象
              const book = _.filter(res.Books, { bookid: current.ID })[0] // 馆藏数据中对应ID的书的数据
              val.FieldValue = Object.assign(current, book) //合并两个对象
              return val
            })
            return v
          })
        })
        this.setState({
          data: data
        })
      })
  }

  getBookId = list => {
    if (list.length > 0) {
      const bookIdStr = list.map(item =>
        item.Data.KNode.map(val => val.DATA.map(v => v.FieldValue.ID)).join(',')
      )
      this.getLibraryStorage(bookIdStr)
    }
  }

  domainSupported = list => {
    return list.length > 0
  }

  //获取句群数据
  getSgData = question => {
    RestTools.httpRequest(
      '/GetSGData',
      'GET',
      {
        q: question
      },
      true
    )
      .then(res => {
        if (res.result) {
          const MetaList = res.MetaList
          console.log(MetaList)
          this.setState({
            loading: false,
            data: MetaList,
            sg: true,
            errMsg: null
          })
        } else {
          this.setState({
            loading: false,
            errMsg: res.msg
          })
        }
      })
      .catch(res => {
        console.log(res)
      })
  }

  //开始搜索
  handleSearch = value => {
    this.setState(
      {
        searchValue: value,
        loading: true,
        bookOpen: false,
        showVoice: false,
        showLayout: false,
        libraryStorage: []
      },
      () => {
        if (this.libraryStorage != undefined && this.libraryStorage != null) {
          this.libraryStorage.updateState()
        }
      }
    )
    RestTools.httpRequest('/GetAnswer', 'GET', {
      appid: 'lib_neu',
      aid: 'ee831eebc9f01c3f18d6c2198ff879b2',
      q: value,
      type: 'mobile'
    })
      .then(res => {
        if (res.result) {
          const MetaList = res.MetaList
          const list = MetaList.filter(
            item => item.Data.domain === '图书馆_图书'
          )
          const businessData = MetaList.filter(
            item =>
              item.Data.Domain === '图书馆_业务数据' ||
              item.Data.Domain === '闲聊_个性'
          )
          if (this.domainSupported(MetaList)) {
            this.setState(
              {
                loading: false,
                data: MetaList,
                errMsg: null
              },
              () => {
                if (
                  list.length > 0 &&
                  list[0].Data.KNode[0].DATA[0].FieldValue.hasOwnProperty(
                    'ID'
                  ) &&
                  businessData.length === 0
                ) {
                  this.getBookId(list)
                }
              }
            )
          }
        } else {
          this.getSgData(value)
        }
      })
      .catch(err => {
        this.setState({
          loading: false
        })
        console.log(err)
      })
  }

  //搜索
  handleSearchClick = value => {
    if (value.trim()) {
      Taro.redirectTo({
        url: `../../pages/result/index?q=${encodeURIComponent(value)}`
      })
    } else {
      Taro.showToast({
        title: '请输入问题哦~',
        icon: 'none'
      })
    }
  }

  showLibraryStorage = data => {
    this.setState(
      {
        bookOpen: true,
        libraryStorage: data
      },
      () => {
        this.libraryStorage.updateState()
      }
    )
  }

  //获取分页数据
  getDataByPage = (current, data, target) => {
    const { domain, intent_domain, intent_id, Title } = data
    RestTools.httpRequest('/GetKBDataByPage', 'GET', {
      domain: domain,
      intent_domain: intent_domain,
      intent_id: intent_id,
      q: Title,
      pageNum: current
    })
      .then(res => {
        let MetaListData = this.state.data //之前state的数据
        MetaListData.map(item => {
          if (item.Data.intent_id === res.karea.intent_id) {
            item.Data = res.karea
          }
          return item
        }) //遍历处理不同的类型的组件点击分页后的数据
        if (res.result) {
          this.setState(
            {
              bookOpen: false,
              libraryStorage: [],
              data: MetaListData
            },
            () => {
              this.getBookId(MetaListData)
              this.libraryStorage.updateState()
              if (target == 'book') {
                this.book.updateState()
              } else if (target == 'bookSame') {
                this.bookSame.updateState()
              } else if (target == 'bookSummary') {
                this.bookSummary.updateState()
              } else if (target == 'news') {
                this.news.updateState()
              } else if (target == 'essay') {
                this.essay.updateState()
              }
            }
          )
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
      .catch(res => {
        console.log(res)
      })
  }

  //返回事件
  handleGoBack = () => {
    Taro.navigateBack()
  }

  switchMic = e => {
    e.preventDefault()
    e.stopPropagation()
    const showVoice = this.state.showVoice
    this.setState({
      showVoice: !showVoice,
      bookOpen: false
    })
  }

  showLayout = value => {
    this.setState({
      ...value
    })
  }

  render() {
    let {
      searchValue,
      data,
      loading,
      showVoice,
      errMsg = null,
      sg,
      isOpened,
      bookOpen,
      libraryStorage,
      User,
      MobileAye,
      MobileNay,
      Aye,
      Nay,
      floatContent,
      floatTitle,
      showLayout
    } = this.state

    let bookData = [], //图书数据
      businessData = [], //图书馆_业务数据
      journalData = [], //期刊
      collegeData = [], //学院类数据
      scholarData = [], //学者类数据
      literatureData = [], //文献类数据
      dynamicData = [], //图书馆_动态数据
      sgData = [], //句群数据
      toolsBookDataList = [],
      toolsBookData = [], //工具书
      gossipData_a = [], //闲聊_个性,
      gossipData_b = [], //闲聊_通用
      weather = [], //天气
      userFaq = []

    data &&
      data.map(item => {
        if (item) {
          if (item.DataType === 0) {
            if (item.Data.Domain === '闲聊_个性') {
              gossipData_a.push(item.Data)
            } else if (item.Data.Domain === '闲聊_通用') {
              gossipData_b.push(item.Data)
            } else {
              businessData.push(item.Data)
              if (businessData[0].Answer.length == 0) {
                errMsg = '1'
              }
            }
          } else if (item.DataType === 3) {
            if (item.Data.domain === '图书馆_图书') {
              bookData.push(item.Data)
            } else if (item.Data.domain === '学校') {
              collegeData.push(item.Data)
            } else if (item.Data.domain === '学者') {
              scholarData.push(item.Data)
            } else if (
              item.Data.domain === '文献' ||
              item.Data.domain === '科研成果'
            ) {
              literatureData.push(item.Data)
            } else if (item.Data.domain === '期刊') {
              journalData.push(item.Data)
            } else if (item.Data.domain === '图书馆_动态') {
              dynamicData.push(item.Data)
            } else if (item.Data.domain === '工具书') {
              toolsBookDataList.push(item.Data)
            } else if (item.Data.domain === '天气') {
              weather.splice(
                0,
                0,
                <Weather
                  data={RestTools.removeRed(
                    item['Data']['KNode'][0]['DATA'][0]['FieldValue']['城市']
                  )}
                />
              )
            }
          } else if (item.DataType === 1) {
            userFaq.push(item.Data)
          } else {
            sgData = data
          }
        }
      })

    toolsBookDataList &&
      toolsBookDataList.map(item => {
        item.KNode.map(v => {
          toolsBookData.push(v)
        })
      })

    for (var i = 0; i < toolsBookData.length; i++) {
      for (var j = i + 1; j < toolsBookData.length; j++) {
        if (
          toolsBookData[i]['DATA'][0]['FieldValue']['条目编码'] ==
          toolsBookData[j]['DATA'][0]['FieldValue']['条目编码']
        ) {
          toolsBookData.splice(j, 1)
          j--
        }
      }
    }

    console.log(journalData)
    return (
      <View className='result'>
        <View className='r_top'>
          <MultiSearch
            searchValue={searchValue}
            onSearch={this.handleSearchClick.bind(this)}
            onGoBack={this.handleGoBack.bind(this)}
          />
          <Icon
            className='micSwitch iconfont icon-microphone'
            onClick={this.switchMic.bind(this)}
          />
        </View>

        <ScrollView
          className='resultWrap'
          scrollY
          scrollWithAnimation
          scrollTop='0'
        >
          {loading ? <AtActivityIndicator mode='center' size={64} /> : null}
          {errMsg ? <NoResult search={this.state.searchValue} /> : null}
          {journalData.length
            ? journalData.map(item => (
              <JournalList
                key={item.id}
                data={item}
                page={item.Page}
                onGetDataByPage={this.getDataByPage.bind(this)}
              />
            ))
            : null}
          {/* 图书馆_业务数据 */}
          {businessData.length && businessData[0].Answer.length != 0 && journalData.length === 0
            ? businessData.map(item => {
              return (
                <Business
                  data={item}
                  likeData={{ User, MobileAye, MobileNay, Aye, Nay }}
                  onClickLike={this.sendLike}
                />
              )
            })
            : null}

          {/* 闲聊_个性 */}
          {gossipData_a.length && businessData.length === 0
            ? gossipData_a.map(item => {
              return (
                <Business
                  data={item}
                  onClickLike={this.sendLike}
                  likeData={{ User, MobileAye, MobileNay, Aye, Nay }}
                />
              )
            })
            : null}

          {/* 天气 */}
          {weather ? weather : null}

          {/* 工具书 */}
          {toolsBookData.length &&
            businessData.length === 0 &&
            gossipData_a.length === 0 &&
            weather.length === 0
            ? toolsBookData.map((item, index) => {
              return <ReferenceList data={item} id={index} />
            })
            : null}

          {/* 图书馆_图书 */}
          {bookData.length &&
            toolsBookData.length === 0 &&
            businessData.length === 0 &&
            gossipData_a.length === 0 &&
            weather.length === 0
            ? bookData.map(item => {
              return item.intent_id === '8' ||
                item.intent_id === '7' ||
                item.intent_id === '4' ||
                item.intent_id === '6' ? (
                  item.intent_id === '8' ? (
                    <BookSummary
                      data={item}
                      page={item.Page}
                      onGetDataByPage={this.getDataByPage.bind(this)}
                      ref={bookSummary => {
                        this.bookSummary = bookSummary
                      }}
                    />
                  ) : (
                      <BookSame
                        data={item}
                        page={item.Page}
                        onGetDataByPage={this.getDataByPage.bind(this)}
                        onShowLibraryStorage={this.showLibraryStorage.bind(this)}
                        ref={bookSame => {
                          this.bookSame = bookSame
                        }}
                      />
                    )
                ) : (
                  <Book
                    data={item}
                    page={item.Page}
                    onGetDataByPage={this.getDataByPage.bind(this)}
                    onShowLibraryStorage={this.showLibraryStorage.bind(this)}
                    ref={book => {
                      this.book = book
                    }}
                  />
                )
            })
            : null}



          {/* 文献 */}
          {literatureData.length && businessData.length === 0
            ? literatureData.map(item => {
              return (
                <Literature
                  data={item}
                  page={item.Page}
                  onGetDataByPage={this.getDataByPage.bind(this)}
                  ref={essay => {
                    this.essay = essay
                  }}
                />
              )
            })
            : null}

          {/* 图书馆_动态 */}
          {dynamicData.length && toolsBookData.length === 0
            ? dynamicData.map(item => {
              return (
                <NewsBlock
                  data={item}
                  page={item.Page}
                  onGetDataByPage={this.getDataByPage.bind(this)}
                  ref={news => {
                    this.news = news
                  }}
                />
              )
            })
            : null}

          {/* 句群 */}
          {sg ? (
            <SgList data={sgData} onShowLayout={this.showLayout.bind(this)} />
          ) : null}

          {/* 闲聊_通用 */}
          {gossipData_b.length &&
            businessData.length === 0 &&
            literatureData.length === 0 &&
            dynamicData.length === 0 &&
            toolsBookData.length === 0 &&
            bookData.length === 0 &&
            gossipData_a.length === 0
            ? gossipData_b.map(item => {
              return (
                <Business
                  data={item}
                  onClickLike={this.sendLike}
                  likeData={{ User, MobileAye, MobileNay, Aye, Nay }}
                />
              )
            })
            : null}

          {/* userFaq */}
          {userFaq.length
            ? userFaq.map(item => {
              return <UserFaq data={item} />
            })
            : null}
          {businessData.length
            ? businessData.map(item => {
              return (
                <Relativity
                  keyword={searchValue}
                  onSearch={this.handleSearchClick.bind(this)}
                  duplicate={item.Question}
                />
              )
            })
            : null}
        </ScrollView>

        {showVoice && (
          <Text
            className='speak'
            onTouchStart={this.handleTouchStart.bind(this)}
            onTouchCancel={this.handleTouchCancel.bind(this)}
            onTouchEnd={this.handleTouchEnd.bind(this)}
          >
            <AtFab size='normal' ref={this.refAtFab}>
              <Icon className='iconfont icon-microphone' />
            </AtFab>
          </Text>
        )}
        <AtToast
          isOpened={isOpened}
          duration={0}
          text='正在聆听...'
          image={voiceRecording}
        />
        <Footer />

        {floatContent && (
          <AtFloatLayout
            isOpened={showLayout}
            scrollY
            title={floatTitle}
            scrollWithAnimation
          >
            <RichText
              className='content'
              nodes={RestTools.lineFeed(RestTools.translteToRed(floatContent))}
            />
          </AtFloatLayout>
        )}

        <LibraryStorage
          bookOpen={bookOpen}
          libraryStorage={libraryStorage}
          ref={libraryStorage => {
            this.libraryStorage = libraryStorage
          }}
        />
      </View>
    )
  }
}
