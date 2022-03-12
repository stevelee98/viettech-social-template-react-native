import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import * as cityActions from 'actions/cityActions';
import * as commonActions from 'actions/commonActions';
import * as placeActions from 'actions/placeAction';
import CustomTab from 'components/customTab';
import FlatListCustom from 'components/flatListCustom';
import Header from 'components/header';
import { ErrorCode } from 'config/errorCode';
import BaseView from 'containers/base/baseView';
import requestCityType from 'enum/requestCityType';
import requestPlaceType from 'enum/requestPlaceType';
import { localizes } from 'locales/i18n';
import { Container, Root } from 'native-base';
import React from 'react';
import { Animated } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view-universal';
import { connect } from 'react-redux';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import ItemChoosePlace from './itemChoosePlace';

class ChoosePlaceView extends BaseView {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			enableLoadMorePlace: false,
			enableLoadMoreCity: false,
			showNoData: false,
			refreshing: false,
			isLoading: false,
			scrollY: new Animated.Value(0),
			tab: 0,
			isLoadingMore: false,
			searchText: null
		};

		const { onChooseTag } = this.props.route.params;
		this.onChooseTag = onChooseTag;
		this.isLoadingMorePlace = false;
		this.isLoadingMoreCity = false;

		this.dataPlaces = [];
		this.dataCities = [];

		this.filterPlace = {
			page: 1,
			pageSize: Constants.PAGE_SIZE,
			search: null
		};

		this.filterCity = {
			page: 1,
			pageSize: Constants.PAGE_SIZE,
			search: null
		};
		this.isLoading;
	}

	componentDidMount = async () => {
		this.getPlaces();
		setTimeout(() => {
			this.getCities();
		}, 200);
	};

	getPlaces = () => {
		this.props.getTopPlaces(this.filterPlace, requestPlaceType.choosePlace);
	};

	getCities = () => {
		this.props.getTopCities(this.filterCity, requestCityType.chooseCity);
	};

	getMorePlace = () => {
		if (!this.isLoadingMorePlace) {
			this.isLoadingMorePlace = true;
			this.filterPlace.page += 1;
			this.getPlaces();
		}
	};

	getMoreCity = () => {
		if (!this.isLoadingMoreCity) {
			this.isLoadingMoreCity = true;
			this.filterCity.page += 1;
			this.getCities();
		}
	};

	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			this.props = nextProps;
			this.handleData();
		}
	}

	handleData = () => {
		let data = this.props.data;
		if (this.props.errorCode != ErrorCode.ERROR_INIT) {
			if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
				if (this.props.action == getActionSuccess(ActionEvent.GET_TOP_PLACES)) {
					if (this.props.requestType == requestPlaceType.choosePlace) {
						if (!Utils.isNull(data) && !Utils.isNull(data.data)) {
							let list = data.data;
							this.state.enableLoadMorePlace = !(
								list.length < Constants.PAGE_SIZE
							);
							if (this.filterPlace.page == 1) {
								this.dataPlaces = [];
							}
							list.forEach(e => {
								this.dataPlaces.push({ ...e, sub: e.city[0] });
							});
						}
					}
				}
				if (this.props.action == getActionSuccess(ActionEvent.GET_TOP_CITIES)) {
					if (this.props.requestType == requestCityType.chooseCity) {
						if (!Utils.isNull(data) && !Utils.isNull(data.data)) {
							let list = data.data;
							this.state.enableLoadMoreCity = !(
								list.length < Constants.PAGE_SIZE
							);
							if (this.filterCity.page == 1) {
								this.dataCities = [];
							}
							list.forEach(e => {
								this.dataCities.push({ ...e, sub: e.national });
							});
						}
					}
				}
				this.state.refreshing = false;
				this.state.isLoading = false;
				this.isLoadingMoreCity = false;
				this.isLoadingMorePlace = false;
			} else {
				this.handleError(this.props.errorCode, this.props.error);
			}
		} else {
			this.handleError(this.props.errorCode, this.props.error);
		}
	};
	handleRefresh = () => {};

	renderListTopPlace = () => {
		const { enableLoadMorePlace } = this.state;
		return (
			<FlatListCustom
				tabLabel={localizes('place.title')}
				onRef={ref => {
					this.listTopPlace = ref;
				}}
				nestedScrollEnabled={true}
				contentContainerStyle={{}}
				style={{ flexGrow: 1 }}
				data={this.dataPlaces}
				enableLoadMore={enableLoadMorePlace}
				onLoadMore={this.getMorePlace}
				renderItem={(item, index) =>
					this.renderItem(item, index, this.dataPlaces)
				}
				keyExtractor={item => item.id}
				showsHorizontalScrollIndicator={false}
				isShowEmpty={this.dataPlaces.length == 0}
				// isShowImageEmpty={true}
				textForEmpty={localizes('noData')}
			/>
		);
	};

	renderListTopCity = () => {
		const { enableLoadMoreCity } = this.state;
		return (
			<FlatListCustom
				tabLabel={localizes('city.title')}
				onRef={ref => {
					this.listTopCity = ref;
				}}
				nestedScrollEnabled={true}
				contentContainerStyle={{}}
				style={{ flexGrow: 1 }}
				data={this.dataCities}
				enableLoadMore={enableLoadMoreCity}
				onLoadMore={this.getMoreCity}
				renderItem={(item, index) =>
					this.renderItem(item, index, this.dataCities)
				}
				keyExtractor={item => item.id}
				showsHorizontalScrollIndicator={false}
				isShowEmpty={this.dataCities.length == 0}
				// isShowImageEmpty={true}
				textForEmpty={localizes('noData')}
			/>
		);
	};
	renderItem = (item, index, listData) => {
		return (
			<ItemChoosePlace
				key={index}
				index={index}
				item={item}
				onChooseTag={item => {
					this.onChooseTag(item);
					this.onBack();
				}}
				length={listData.length}
				onPress={item => {
					this.props.navigation.navigate('PlaceDetail', { placeId: item._id });
				}}
			/>
		);
	};

	render() {
		return (
			<Container style={{ flex: 1 }}>
				<Header
					shadow={true}
					title={localizes('tagPlace')}
					visibleBack={true}
					navigation={this.props.navigation}
					statusBarColor={Colors.COLOR_WHITE}
				/>
				<Root>
					<ScrollableTabView
						initialPage={0}
						tabBarActiveTextColor={Colors.COLOR_PRIMARY}
						tabBarInactiveTextColor={Colors.COLOR_TEXT}
						tabBarUnderlineStyle={{ backgroundColor: Colors.COLOR_PRIMARY }}
						renderTabBar={() => <CustomTab />}
					>
						{this.renderListTopPlace()}
						{this.renderListTopCity()}
					</ScrollableTabView>
				</Root>
				{!this.state.isLoadingMore
					? this.state.refreshing
						? null
						: this.showLoadingBar(this.props.isLoading)
					: null}
			</Container>
		);
	}
}

const mapStateToProps = state => ({
	data: state.choosePlace.data,
	isLoading: state.choosePlace.isLoading,
	errorCode: state.choosePlace.errorCode,
	action: state.choosePlace.action,
	requestType: state.choosePlace.requestType
});

const mapDispatchToProps = {
	...commonActions,
	...cityActions,
	...placeActions
};
export default connect(mapStateToProps, mapDispatchToProps)(ChoosePlaceView);
