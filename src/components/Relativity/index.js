import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtList, AtListItem, AtActivityIndicator } from "taro-ui";
// import _ from "lodash";
// import RestTools from "../../utils/RestTools";
import "./index.styl";

class Relativity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      duplicate : props.duplicate,
			array:JSON.parse(localStorage.getItem('History')),
    };
  }

  componentWillMount() {
    const keyword = this.props.keyword;

    keyword &&
      Taro.request({
        url: "http://ai.cnki.net/dn.qa.r/api/GetKB",
        method: "GET",
        data: {
          content: keyword
        }
      })
        .then(res => {
          if (res.statusCode === 200) {
            const relaQuestions = res.data.filter(item => item.Content != this.state.duplicate);
            this.setState({
              data: relaQuestions,
              loading: false
            });
          }
        })
        .catch(res => {
          console.log(res);
          this.setState({
            loading: false
          });
        });
  }

  handleClick = item => {
    this.props.onSearch(item.Content);
		this.state.array=JSON.parse(localStorage.getItem('History'))
		this.state.array.unshift(item.Content);
		for(var i=0;i<this.state.array.length;i++){
			for(var j=i+1;j<this.state.array.length;j++){
				if(this.state.array[i]===this.state.array[j]){
					this.state.array.splice(j,1);
					i--;
				}
			}
		}
					if(this.state.array.length>10){
						this.state.array.pop();
					}
		localStorage.setItem("History",JSON.stringify(this.state.array));
  };

  render() {
    const { data, loading } = this.state;
    return (
      <View className='relativity'>
        {loading ? (
          <AtActivityIndicator mode='center' />
        ) : data.length > 0 ? (
          <AtList>
            {data.map(item => {
              return (
                <AtListItem
                  key={item.QID}
                  title={item.Content}
                  arrow='right'
                  onClick={this.handleClick.bind(this, item)}
                  iconInfo={{ value: "tag", color: "#6190E8" }}
                />
              );
            })}
          </AtList>
        ):''}
      </View>
    );
  }
}

export default Relativity;
