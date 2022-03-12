import ImageLoader from 'components/imageLoader';
import MainList from 'components/mainList';
import ModalImageViewer from 'containers/common/modalImageViewer';
import React, { useRef } from 'react';
import { Pressable, View } from 'react-native';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import styles from './styles';

const NewfeedResources = props => {
    const { index, images } = props;
    const modalImageViewer = useRef();

    const renderItem = ({ item, index }) => {
        return (
            <Pressable
                android_ripple={Constants.ANDROID_RIPPLE}
                onPress={() => {
                    showImage(index);
                }}
                style={styles.itemContainer}
            >
                <ImageLoader
                    path={item.url}
                    style={{
                        flex: 1,
                        width: Constants.MAX_WIDTH,
                        aspectRatio: 1,
                    }}
                />
            </Pressable>
        );
    };

    const showImage = i => {
        modalImageViewer.current.showModal(images, i);
    };

    return (
        <View>
            <MainList
                contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: Colors.COLOR_BACKGROUND,
                }}
                style={{}}
                data={images}
                nestedScrollEnabled
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
            />
            <ModalImageViewer ref={modalImageViewer} />
        </View>
    );
};

export default React.memo(NewfeedResources);
