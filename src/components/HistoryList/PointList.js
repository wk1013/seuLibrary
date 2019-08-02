import Taro, { Component } from "@tarojs/taro";
import { View, Text} from "@tarojs/components";
import { AtSearchBar, AtForm, AtIcon} from "taro-ui";
import "./index.styl";

export default class SearchPanel extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	    listItems:this.props.PointValue,
		display:this.props.display,
		keyword:this.props.keyword,
		array:[]
	  };
	}
	
	componentWillReceiveProps(nextProps) {
	  this.setState({
		listItems:nextProps.PointValue,
		display:nextProps.display,
		keyword:nextProps.keyword
	  });
	}
	
	handleChange(item) { 
		this.state.array=JSON.parse(localStorage.getItem('History'))||[];
		this.state.array.unshift(item);
		for(var i=0;i<this.state.array.length;i++){
			for(var j=i+1;j<this.state.array.length;j++){
				if(this.state.array[i]===this.state.array[j]){
					this.state.array.splice(j,1);
					i--;
				}
			}
		}
		localStorage.setItem("History",JSON.stringify(this.state.array));
		let context = this
		setTimeout(function(){
			context.props.onSearch(item);
		},500)
	}
	
	render() {
		let listItems = this.state.listItems;
		if(this.state.listItems.length>10){
			listItems = listItems.slice(0,10)
		}
		const recordList = listItems.length?listItems.map(item => 
			<View className="List-a" 
				onMousedown={e => e.preventDefault()} 
				onClick ={this.handleChange.bind(this,item.value)}
				dangerouslySetInnerHTML={{__html: item.value.replace(this.state.keyword, `<Strong style="color:red">${this.state.keyword}</Strong>`)}}
			/>
		):null;
		return (
			<View className={this.props.className} style={{'display':this.state.display}}>
				{recordList}
			</View>
		)
	}
}