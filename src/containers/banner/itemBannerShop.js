import ImageLoader from 'components/imageLoader';
import platformType from 'enum/platformType';
import StatusType from 'enum/statusType';
import React, { PureComponent } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import commonStyles from 'styles/commonStyles';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import styles from './styles';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class ItemBannerShop extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <View>{this.renderItemBlog()}</View>;
    }

    /**
     * Render item blog
     */
    renderItemBlog = () => {
        const { data, index, urlPathResize, screenType, onPressDetail } =
            this.props;
        let widthImage = screenWidth - 2 * Constants.MARGIN16;
        let heightImage = screenWidth * Utils.sizeBanner('16:9');
        return (
            <View style={[styles.main]}>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    onPress={() => onPressDetail(data)}
                >
                    {/* image */}
                    <View>
                        <ImageLoader
                            resizeModeType={'cover'}
                            resizeAtt={{ type: 'resize', height: heightImage }}
                            style={[
                                styles.imageBanner,
                                { width: widthImage, height: heightImage },
                            ]}
                            path={urlPathResize + '=' + data.pathToResource}
                        />
                    </View>
                    <View style={[styles.textStatus, { flexDirection: 'row' }]}>
                        {!Utils.isNull(data.platform) ? (
                            <Text
                                style={[
                                    commonStyles.textMedium,
                                    {
                                        margin: 0,
                                        color: Colors.COLOR_BLUE_LIGHT,
                                    },
                                ]}
                            >
                                {data.platform == platformType.MOBILE
                                    ? 'Banner Mobile: '
                                    : data.platform == platformType.WEB &&
                                      'Banner Desktop: '}
                            </Text>
                        ) : null}
                        <Text
                            numberOfLines={2}
                            style={[
                                commonStyles.textMedium,
                                {
                                    margin: 0,
                                    flex: 1,
                                    color: Colors.COLOR_BLUE_LIGHT,
                                },
                            ]}
                        >
                            {this.renderStatus(data.status)}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    /**
     * Render status banner
     */
    renderStatus = status => {
        switch (status) {
            case StatusType.DRAFT:
                return 'Đang chờ duyệt';
            case StatusType.ACTIVE:
                return 'Đã duyệt';
            case StatusType.DELETE:
                return 'Đã xóa';
            case StatusType.SUSPENDED:
                return 'Bị từ chối';
        }
    };
}

export default ItemBannerShop;
