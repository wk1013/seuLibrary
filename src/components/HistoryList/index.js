import Taro, { Component } from "@tarojs/taro";
import { View, Text} from "@tarojs/components";
import {AtIcon} from "taro-ui";
import "./index.styl";

export default class SearchPanel extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	    listItems:this.props.HistoryValue,
		display:this.props.display,
		array:[]
	  };
	}
	
	componentWillReceiveProps(nextProps) {
	  this.setState({
		listItems:nextProps.HistoryValue,
		display:nextProps.display
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
	
	//删除历史记录
	closebutton(e,index){
		e.preventDefault()
		e.stopPropagation();
		for(var i=0;i<this.state.listItems.length;i++){
			if(index===this.state.listItems[i]){
				this.state.listItems.splice(i,1);
			}
		}
		localStorage.setItem("History",JSON.stringify(this.state.listItems));
		this.setState({
			display:'block',
			listItems:JSON.parse(localStorage.getItem('History'))
		})
	}
	
	render() {
		const listItems = this.state.listItems;
		const recordList = listItems.length?listItems.map(item => 
			<View className="List-text"
				onMousedown={e => e.preventDefault()} 
				onClick ={this.handleChange.bind(this,item)}
			>{item}
				<Text onClick ={(e)=>this.closebutton(e,item.toString())}>	
					<AtIcon value='close' size='10' color='#333'></AtIcon>
				</Text>
			</View>
		):null;
		return (
			<View className={this.props.className} style={{'display':this.state.display}}>
				{recordList}
			</View>
		)
	}
}