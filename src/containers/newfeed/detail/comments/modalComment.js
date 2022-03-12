import Hr from 'components/hr';
import MainList from 'components/mainList';
import fakeData from 'containers/home/fakeData';
import ic_cancel from 'images/ic_cancel_white.png';
import ic_comment_black from 'images/ic_comment_black.png';
import ic_send_green from 'images/ic_send_green.png';
import { localizes } from 'locales/i18n';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
    Image,
    Keyboard,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import commonStyles from 'styles/commonStyles';
import StringUtil from 'utils/stringUtil';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';
import ItemComment from './itemComment';
import ModalChildComment from './modalChildComment';

const ModalComment = (props, ref) => {
    const [isVisible, setVisible] = useState(false);
    const [content, setContent] = useState(false);
    const [keyboardHeight, setKeyBoardHeight] = useState(0);
    const modalComment = useRef();
    const modalChildComment = useRef();
    const data = fakeData.comment;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            keyboardWillShow,
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            keyboardWillHide,
        );

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    const keyboardWillShow = e => {
        setKeyBoardHeight(e.endCoordinates.height);
    };

    const keyboardWillHide = e => {
        setKeyBoardHeight(0);
    };

    useImperativeHandle(ref, () => ({
        showModal,
    }));

    /// Show modal
    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    const renderListComment = () => {
        return (
            <MainList
                style={style.listCmt}
                data={data}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                isShowEmpty={true}
                showsVerticalScrollIndicator={false}
                textForEmpty={localizes('no_comment_yet')}
            />
        );
    };

    const renderItem = ({ item, index }) => {
        return (
            <ItemComment
                index={index}
                key={index}
                item={item}
                openModalChildComment={openModalChildComment}
            />
        );
    };

    const openModalChildComment = parent => {
        modalChildComment.current.showModal(parent);
    };

    const renderDock = () => {
        return (
            <View
                style={{
                    marginBottom: keyboardHeight,
                }}
            >
                <Hr width={2} color={Colors.COLOR_BACKGROUND} />
                <View
                    style={{
                        alignSelf: 'flex-end',
                    }}
                >
                    <View style={style.sendCommentView}>
                        <TextInput
                            multiline={true}
                            placeholder={localizes('write_comment')}
                            style={style.inputComment}
                            onChangeText={content => setContent(content)}
                            value={content}
                            underlineColorAndroid="transparent"
                        />
                        <View style={style.btnSend}>
                            <Pressable
                                onPress={() => {}}
                                android_ripple={Constants.ANDROID_RIPPLE}
                                style={{ padding: Constants.PADDING }}
                            >
                                <Image source={ic_send_green} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderHeader = () => {
        return (
            <View style={style.headerComment}>
                <View style={style.headerContent}>
                    <Pressable style={style.btnBack}>
                        <Image source={ic_comment_black} />
                        <Text style={style.totalComment}>
                            {' ' + StringUtil.formatNumber(1562)}
                        </Text>
                    </Pressable>
                    <Pressable onPress={hideModal}>
                        <Image source={ic_cancel}></Image>
                    </Pressable>
                </View>
                <Hr width={2} color={Colors.COLOR_BACKGROUND} />
            </View>
        );
    };

    return (
        <SafeAreaView>
            <Modal
                ref={modalComment}
                isVisible={isVisible}
                style={{
                    flexGrow: 1,
                    margin: 0,
                    padding: 0,
                    zIndex: 999,
                    paddingTop: Constants.HEIGHT_HEADER_OFFSET_REFRESH,
                }}
                onBackButtonPress={hideModal}
                animationIn={'slideInUp'}
                animationInTiming={400}
                backdropOpacity={0.4}
                onBackdropPress={hideModal}
                statusBarTranslucent={true}
                useNativeDriver={Platform.OS === 'android'}
                coverScreen={true}
                avoidKeyboard={false}
            >
                <View style={style.container}>
                    {renderHeader()}
                    {renderListComment()}
                    {renderDock()}
                </View>
            </Modal>
            <ModalChildComment ref={modalChildComment} />
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Colors.COLOR_WHITE,
    },
    headerComment: {
        backgroundColor: Colors.COLOR_WHITE,
        borderTopLeftRadius: Constants.CORNER_RADIUS * 2.5,
        borderTopRightRadius: Constants.CORNER_RADIUS * 2.5,
    },
    headerContent: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        margin: Constants.MARGIN12,
    },
    btnBack: { flexDirection: 'row', alignItems: 'center' },
    totalComment: {
        ...commonStyles.textXSmall,
        fontSize: Fonts.FONT16,
    },
    listCmt: {
        flexGrow: 1,
        marginTop: Constants.MARGIN12,
    },
    sendCommentView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Constants.PADDING16,
        paddingVertical: Constants.PADDING8,
        width: Constants.MAX_WIDTH,
        backgroundColor: Colors.COLOR_WHITE,
    },
    inputComment: {
        ...commonStyles.text,
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: Colors.COLOR_BACKGROUND,
        borderRadius: Constants.CORNER_RADIUS * 4,
        paddingHorizontal: Constants.PADDING16,
        maxHeight: 100,
    },
    btnSend: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: Constants.MARGIN16,
    },
});

export default React.forwardRef(ModalComment);
