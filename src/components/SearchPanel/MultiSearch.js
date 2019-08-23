import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtSearchBar, AtForm } from "taro-ui";
import HistoryList from "../../components/HistoryList";
import PointList from "../../components/HistoryList/PointList";
import "./MultiSearch.styl";
import RestTools from '../../utils/RestTools'

export default class SearchPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.searchValue || "",
			listItems: JSON.parse(localStorage.getItem('History')) || [],
			PointItems: [],
			array: JSON.parse(localStorage.getItem('History'))|| [],
			display: 'none',
			display_a: 'none',
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.searchValue
		});
	}

	onChange = value => {
		RestTools.getInputTips(value).then(res => {
			this.setState({
				PointItems: res,
				display_a: 'block'
			})
		})
		this.setState({
			value: value,
			display: 'none'
		});
		if (value == '') {
			this.setState({
				display: 'block',
				display_a: 'none'
			});
		}
	};

	onFocus() {
		this.setState({
			// value: '',
			display: 'block',
			listItems: JSON.parse(localStorage.getItem('History')) || []
		})
	}

	onBlur() {
		this.setState({
			display: 'none',
			display_a: 'none'
		})
	}

	onActionClick() {
		const value = this.state.value.trim();
		if (value) {
			this.props.onSearch(value);
			this.state.array = JSON.parse(localStorage.getItem('History'))
			this.state.array.unshift(value);
			for (var i = 0; i < this.state.array.length; i++) {
				for (var j = i + 1; j < this.state.array.length; j++) {
					if (this.state.array[i] === this.state.array[j]) {
						this.state.array.splice(j, 1);
						i--;
					}
				}
			}
			if (this.state.array.length > 10) {
				this.state.array.pop();
			}
			localStorage.setItem("History", JSON.stringify(this.state.array));
		} else {
			Taro.showToast({ title: '问题不能为空哟', icon: 'none' })
		}
	}

	handleClick = () => {
		this.props.onGoBack();
	};

	goToHome = () => {
		Taro.navigateTo({
			url: '../index/index'
		})
	}

	render() {
		return (
			<AtForm onSubmit={this.onActionClick.bind(this)}>
				<View className='m_backgroundWrap'>
					<View
						className='at-icon back at-icon-chevron-left'
						onClick={this.handleClick.bind(this)}
					/>
					<AtSearchBar
						showActionButton
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
						className='HistoryList_a'
					/>
					<PointList display={this.state.display_a}
						PointValue={this.state.PointItems}
						onSearch={this.props.onSearch}
						className='HistoryList_a'
						keyword={this.state.value}
					/>
				</View>
			</AtForm>
		);
	}
}
