import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtForm, AtSearchBar, AtIcon } from "taro-ui";
import "./index.styl";
import HistoryList from "../../components/HistoryList";
import PointList from "../../components/HistoryList/PointList";
import RestTools from '../../utils/RestTools'

let timer = null;

export default class SearchPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.searchValue || "",
			listItems: JSON.parse(localStorage.getItem('History')) || [],
			PointItems: [],
			display: 'none',
			display_a: 'none',
			tid: ''
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.searchValue
		});
	}

	onChange = value => {
		this.setState({
			value: value,
			display: 'none'
		});
		clearTimeout(timer)
		timer = setTimeout(() => {
			var that = this;
			RestTools.getInputTips(value).then(res => {
				console.log(res)
				that.setState({
					PointItems: res,
					display_a: 'block'
				})
			})
		}, 500)
		if (value == '') {
			this.setState({
				display: 'block',
				display_a: 'none'
			});
		}
	};

	onActionClick() {
		const value = this.state.value.trim();
		if (value) {
			this.props.onSearch(value);
		} else {
			Taro.showToast({ title: '问题不能为空哟', icon: 'block' })
		}
	}

	//搜索框聚焦函数
	onFocus() {
		this.setState({
			// value: '',
			display: 'block',
			listItems: JSON.parse(localStorage.getItem('History')) || []
		})
	}

	//搜索框失去焦点函数
	onBlur() {
		this.setState({
			display: 'none',
			display_a: 'none'
		})
	}

	goToHome = () => {
		Taro.navigateTo({
			url: "index"
		});
	};

	render() {
		return (
			<AtForm onSubmit={this.onActionClick.bind(this)}>
				<View className='backgroundWrap'>
					<AtSearchBar
						showActionButton={true}
						className='search'
						value={this.state.value}
						actionName='提问'
						placeholder='请输入问题'
						onChange={this.onChange.bind(this)}
						onActionClick={this.onActionClick.bind(this)}
						onFocus={this.onFocus.bind(this)}
						onBlur={this.onBlur.bind(this)}
						onClear={this.onFocus.bind(this)}
					/>
					<HistoryList display={this.state.display}
						HistoryValue={this.state.listItems}
						onSearch={this.props.onSearch}
						className='HistoryList'
					/>
					<PointList display={this.state.display_a}
						PointValue={this.state.PointItems}
						onSearch={this.props.onSearch}
						className='HistoryList'
						keyword={this.state.value}
					/>
				</View>
			</AtForm>
		);
	}
}
