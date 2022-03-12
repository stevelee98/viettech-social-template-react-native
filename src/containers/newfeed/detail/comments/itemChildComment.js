import ImageLoader from 'components/imageLoader';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Constants } from 'values/constants';
import styles from './styles';

const ItemChildComment = props => {
    const { item, index, lengthData } = props;

    const renderContent = () => {
        return (
            <View style={styles.contentChildView}>
                <Pressable
                    style={styles.avatarBtn}
                    android_ripple={Constants.ANDROID_RIPPLE}
                >
                    <ImageLoader
                        path={item.user ? item.user.avatar : ''}
                        style={styles.avatarCommentChild}
                        resizeModeType={'cover'}
                    />
                </Pressable>
                <Text style={styles.authorChildComment}>{item.user?.name}</Text>
                <Text
                    style={styles.txtChildComment}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.content}
                </Text>
            </View>
        );
    };

    if (index == lengthData - 1 || index == lengthData - 2) {
        return (
            <View
                style={{
                    marginTop: index == 0 ? 0 : Constants.MARGIN,
                    marginHorizontal: Constants.MARGIN16,
                }}
            >
                {renderContent()}
            </View>
        );
    }
    return null;
};

export default React.memo(ItemChildComment);
