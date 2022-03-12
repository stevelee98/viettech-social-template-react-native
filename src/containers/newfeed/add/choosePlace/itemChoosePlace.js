import Hr from 'components/hr';
import ImageLoader from 'components/imageLoader';
import React, { PureComponent } from 'react';
import { Pressable, Text, View } from 'react-native';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

class ItemChoosePlace extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { item, onPress, lengthData, index, onChooseTag } = this.props;
		return (
			<Pressable
				android_ripple={Constants.ANDROID_RIPPLE}
				onPress={() => {
					onChooseTag(item);
				}}
				style={{
					paddingHorizontal: Constants.paddingXXLarge,
					paddingVertical: Constants.paddingLarge
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<ImageLoader
						path={item.avatar}
						resizeModeType={'cover'}
						style={{
							width: 50,
							height: 50,
							borderRadius: Constants.CORNER_RADIUS
						}}
					/>
					<View style={{ flex: 1, marginLeft: Constants.marginXLarge }}>
						<Text
							numberOfLines={2}
							ellipsizeMode={'tail'}
							style={{ ...commonStyles.text }}
						>
							{item.name}
						</Text>
						<Text
							numberOfLines={2}
							style={{
								...commonStyles.textXSmall,
								color: Colors.COLOR_DRK_GREY,
								marginTop: 4
							}}
						>
							{item.sub.name}
						</Text>
					</View>
				</View>
				<Hr style={{ marginTop: Constants.marginLarge }} />
			</Pressable>
		);
	}
}

export default ItemChoosePlace;
