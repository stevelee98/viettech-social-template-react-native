import Hr from 'components/hr';
import MainList from 'components/mainList';
import ic_cancel from 'images/ic_cancel_white.png';
import ic_send_green from 'images/ic_send_green.png';
import { localizes } from 'locales/i18n';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
    Image,
    Keyboard,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import ItemComment from './itemComment';

const ModalChildComment = (props, ref) => {
    const [isVisible, setVisible] = useState(false);
    const [content, setContent] = useState(false);
    const [comment, setComment] = useState([]);
    const [keyboardHeight, setKeyBoardHeight] = useState(0);
    const modalChildComment = useRef();

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
    const showModal = comment => {
        setComment(comment);
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
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
                    <View style={styles.sendCommentView}>
                        <TextInput
                            multiline={true}
                            placeholder={localizes('write_comment')}
                            style={styles.inputComment}
                            onChangeText={content => setContent(content)}
                            value={content}
                            underlineColorAndroid="transparent"
                        />
                        <View style={styles.btnSend}>
                            <Pressable
                                android_ripple={Constants.ANDROID_RIPPLE_2}
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
            <View style={styles.headerComment}>
                <View style={styles.headerContent}>
                    <Pressable style={styles.btnBack}>
                        <Text style={styles.totalComment}>
                            {localizes('comment_by') + 'Steve'}
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

    const renderListComment = () => {
        return (
            <MainList
                style={styles.listCmt}
                data={comment ? comment.childs : []}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                isShowEmpty={true}
                showsVerticalScrollIndicator={false}
                textForEmpty={localizes('no_comment_yet')}
                ListHeaderComponent={renderParentComment}
            />
        );
    };

    const renderItem = ({ item, index }) => {
        return <ItemComment index={index} key={index} item={item} />;
    };

    const renderParentComment = () => {
        return (
            <ItemComment
                showChild={false}
                screenType={'child'}
                item={comment}
                index={0}
            />
        );
    };

    return (
        <SafeAreaView>
            <Modal
                ref={modalChildComment}
                isVisible={isVisible}
                style={{
                    flexGrow: 1,
                    width: Constants.MAX_WIDTH,
                    margin: 0,
                    padding: 0,
                    zIndex: 999,
                    paddingTop: Constants.HEIGHT_HEADER_OFFSET_REFRESH,
                }}
                onBackButtonPress={hideModal}
                animationIn={'slideInRight'}
                animationInTiming={400}
                backdropOpacity={0.4}
                onBackdropPress={hideModal}
                statusBarTranslucent={true}
                useNativeDriver={Platform.OS === 'android'}
                coverScreen={true}
                avoidKeyboard={false}
            >
                <View style={styles.container}>
                    {renderHeader()}
                    {renderListComment()}
                    {renderDock()}
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
        ...commonStyles.textXXSmall,
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

export default React.forwardRef(ModalChildComment);
