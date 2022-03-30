import ic_close_black from 'images/ic_close_black.png';
import ic_global from 'images/ic_global.png';
import ic_global_small from 'images/ic_global_small.png';
import ic_private from 'images/ic_private.png';
import ic_private_small from 'images/ic_private_small.png';
import { localizes } from 'locales/i18n';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modalbox';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

const ModalPrivacy = (props, ref) => {
    const [privacy, setPrivacy] = useState({
        icon: ic_global,
        name: localizes('public'),
        description: localizes('peopel_can_see'),
        type: 'public',
    });
    const modalRef = useRef();
    const data = [
        {
            icon: ic_global,
            icon_small: ic_global_small,
            name: localizes('public'),
            description: localizes('peopel_can_see'),
            type: 'public',
        },
        {
            icon: ic_private,
            icon_small: ic_private_small,
            name: localizes('private'),
            description: localizes('just_you_see'),
            type: 'private',
        },
    ];
    const { onChange } = props;

    useImperativeHandle(ref, () => ({
        openModal,
    }));

    /// show modal
    const openModal = pri => {
        setPrivacy(pri);
        modalRef.current.open();
    };

    ///  hide Modal
    const hideModal = () => {
        modalRef.current.close();
    };

    return (
        <Modal
            ref={modalRef}
            style={styles.modalContainer}
            backdrop={true}
            onClosed={hideModal}
            position={'bottom'}
            swipeToClose={false}
            backButtonClose={true}
            coverScreen={true}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={hideModal}
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    style={styles.btnClose}
                >
                    <Image source={ic_close_black} />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {localizes('how_to_your_post_show')}
                </Text>
                <View style={styles.contentContainer}>
                    {data.map((e, i) => {
                        return (
                            <Pressable
                                key={'privacy' + i}
                                style={{
                                    ...styles.item,
                                    borderColor:
                                        privacy.type == e.type
                                            ? Colors.COLOR_PRIMARY
                                            : Colors.COLOR_BACKGROUND,
                                    backgroundColor:
                                        privacy.type == e.type
                                            ? Colors.COLOR_WHITE
                                            : Colors.COLOR_BACKGROUND,
                                    borderWidth: 1,
                                }}
                                android_ripple={Constants.ANDROID_RIPPLE}
                                onPress={() => {
                                    onChange && onChange(e);
                                    hideModal();
                                }}
                            >
                                <Image source={e.icon} />
                                <View
                                    style={{ marginLeft: Constants.MARGIN12 }}
                                >
                                    <Text style={commonStyles.text}>
                                        {e.name}
                                    </Text>
                                    <Text style={styles.description}>
                                        {e.description}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </Modal>
    );
};
export default React.forwardRef(ModalPrivacy);
const styles = {
    modalContainer: {
        // alignSelf: 'flex-end',
        // justifyContent: 'flex-end',
        height: null,
    },
    item: {
        ...commonStyles.horizontal,
        borderRadius: Constants.CORNER_RADIUS,
        backgroundColor: Colors.COLOR_BACKGROUND,
        paddingHorizontal: Constants.PADDING12,
        paddingVertical: Constants.PADDING8,
        marginTop: Constants.MARGIN12,
    },
    description: {
        ...commonStyles.textXSmall,
        color: Colors.COLOR_TEXT_LIGHT,
    },
    btnClose: {
        padding: Constants.PADDING8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    contentContainer: {
        paddingHorizontal: Constants.PADDING16,
        paddingBottom: Constants.MARGIN16,
    },
    title: {
        ...commonStyles.textLargeBold,
        marginHorizontal: Constants.MARGIN16,
        marginBottom: Constants.MARGIN8,
    },
    container: {
        backgroundColor: Colors.COLOR_WHITE,
        justifyContent: 'flex-end',
    },
};
