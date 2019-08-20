import Taro, { Component } from '@tarojs/taro'
import { View, Text, Icon } from '@tarojs/components'
import { AtFab, AtToast, AtList, AtListItem } from 'taro-ui'
import RestTools from '../../utils/RestTools';
import MultiSearch from '../../components/SearchPanel/MultiSearch';
import Footer from '../../components/Footer';
import voiceRecording from '../../statics/voice-recording.gif';
import mockData from "../../mock/mockData.json";
import './index.styl'

export default class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchValue: '',
            showVoice: false,
            isOpened: false,
            showIcon: false,
            message: []
        }
    }

    componentWillMount() {
        const guid = RestTools.GetGUID();
        // RestTools.httpRequest('', 'GET', {
        //   guid: guid
        // }).then(res => {
        //   const message = res;
        //   this.setState({
        //     message: message
        //   })
        // }).catch(res => {
        //   console.log(res)
        // })
        const message = mockData.message
        this.setState({
            message: message
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
                success: function () {
                    this.setState({
                        showIcon: true
                    })
                }
            })
        })
    }

    handleTouchStart = e => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
            isOpened: true
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
                            },
                            () => {
                                Taro.navigateTo({
                                    url: `../result/index?q=${encodeURIComponent(
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

    //搜索
    handleSearchClick = value => {
        if (value.trim()) {
            Taro.navigateTo({
                url: `../result/index?q=${encodeURIComponent(value)}`
            })
        } else {
            Taro.showToast({
                title: '请输入问题哦~',
                icon: 'none'
            })
        }
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
        })
    }

    handleClick = value => {
        Taro.navigateTo({
            url: `../result/index?q=${encodeURIComponent(value)}`
        })
    }

    render() {
        let {
            searchValue,
            showVoice,
            isOpened,
            showIcon
        } = this.state
        const data = this.state.message;
        const List = data.length > 0 ? data.map(item =>
            <AtListItem
                key={item.id}
                title={item.question}
                onClick={this.handleClick.bind(this, item.question)}
                iconInfo={{ value: "tag" }}
            />
        ) : (<View className="none">温馨提示，您没有未查看过的消息！</View>)
        return (
            <View className="message">
                <View className='r_top'>
                    <MultiSearch
                        searchValue={searchValue}
                        onSearch={this.handleSearchClick.bind(this)}
                        onGoBack={this.handleGoBack.bind(this)}
                    />
                    {showIcon ? <Icon
                        className='micSwitch iconfont icon-microphone'
                        onClick={this.switchMic.bind(this)}
                    /> : null}
                </View>

                <View className='relativity'>
                    <AtList>
                        {List}
                    </AtList>
                </View>

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
            </View>
        )
    }
}