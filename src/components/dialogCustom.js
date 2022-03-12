import Dialog from 'components/dialog';
import ic_close from 'images/ic_close.png';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import commonStyles from 'styles/commonStyles';
import StringUtil from 'utils/stringUtil';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import ButtonCustom from './button';
import Hr from './hr';

class DialogCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible,
        });
    }

    /**
     * text: ex: "do you want to logout?"
     */
    renderContentText() {
        const { contentText, styleContentText, styleContainerText } =
            this.props;
        return (
            <View style={styleContainerText}>
                <Text
                    style={[
                        {
                            ...commonStyles.textMedium,
                            textAlign: 'center',
                            padding: Constants.PADDING16,
                            paddingVertical: Constants.PADDING8,
                        },
                        styleContentText,
                    ]}
                >
                    {contentText}
                </Text>
            </View>
        );
    }

    /**
     * for choose images from camera and gallery
     */
    renderContentForChooseImg() {
        const {
            styleItemRow,
            styleContainerFroImg,
            onPressCamera,
            onPressGallery,
            showVideo,
            onPressVideo,
        } = this.props;
        return (
            <View style={[styleContainerFroImg]}>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    block
                    info
                    onPress={() => onPressCamera()}
                >
                    <Text
                        style={[
                            commonStyles.text,
                            {
                                marginHorizontal: Constants.MARGIN16,
                                marginVertical:
                                    Constants.MARGIN8 + Constants.MARGIN,
                            },
                            styleItemRow,
                        ]}
                    >
                        Chụp ảnh
                    </Text>
                </TouchableOpacity>
                <Hr />
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    block
                    info
                    onPress={() => onPressGallery()}
                >
                    <Text
                        style={[
                            commonStyles.text,
                            {
                                marginHorizontal: Constants.MARGIN16,
                                marginVertical:
                                    Constants.MARGIN8 + Constants.MARGIN,
                            },
                            styleItemRow,
                        ]}
                    >
                        Thư viện
                    </Text>
                </TouchableOpacity>
                {this.props.showVideo ? <Hr /> : null}
                {this.props.showVideo ? (
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        block
                        info
                        onPress={() => onPressVideo()}
                    >
                        <Text
                            style={[
                                commonStyles.text,
                                {
                                    marginLeft: 0,
                                    marginVertical:
                                        Constants.MARGIN8 + Constants.MARGIN,
                                },
                                styleItemRow,
                            ]}
                        >
                            Video
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    }

    /**
     * render title for dialog
     */
    renderTitle() {
        const { contentTitle, styleItemBtn, onPressX, styleTextTitle } =
            this.props;
        return (
            <View
                style={[
                    commonStyles.viewHorizontal,
                    commonStyles.viewCenter,
                    {
                        flex: 0,
                    },
                ]}
            >
                <Text
                    style={[
                        {
                            ...commonStyles.textBold,
                            flex: 1,
                            textAlign: 'center',
                            marginVertical: Constants.MARGIN8,
                        },
                        styleTextTitle,
                    ]}
                >
                    {contentTitle}
                </Text>
                {onPressX ? (
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        block
                        style={styles.btnClose}
                        info
                        onPress={() => onPressX()}
                    >
                        <Image source={ic_close} />
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    }

    /**
     * Render one button
     */
    renderOneButton() {
        const {
            textBtn,
            styleContainerBtn,
            styleTextBtn,
            onPressBtn,
            styleItemBtn,
        } = this.props;
        return (
            <View
                style={{
                    backgroundColor: Colors.COLOR_WHITE,
                    borderBottomLeftRadius: Constants.CORNER_RADIUS,
                    borderBottomRightRadius: Constants.CORNER_RADIUS,
                }}
            >
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        },
                        styleContainerBtn,
                    ]}
                >
                    <ButtonCustom
                        containerStyle={{ flex: 1 }}
                        style={[{ margin: Constants.MARGIN16 }, styleItemBtn]}
                        onPress={() => {
                            onPressBtn();
                        }}
                        title={textBtn}
                    />
                </View>
            </View>
        );
    }

    /**
     * render btn Cancel and ...
     */
    renderTwoButton() {
        const {
            textBtnOne,
            textBtnTwo,
            styleContainerBtn,
            styleItemBtn,
            styleTextBtnTwo,
            styleTextBtnOne,
            onPressX,
            onPressBtnOne,
            onPressBtnPositive,
        } = this.props;
        return (
            <View
                style={{
                    backgroundColor: Colors.COLOR_WHITE,
                    marginTop: Constants.MARGIN16,
                    borderBottomLeftRadius: Constants.CORNER_RADIUS,
                    borderBottomRightRadius: Constants.CORNER_RADIUS,
                }}
            >
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            paddingHorizontal: Constants.PADDING16,
                            paddingVertical: Constants.PADDING12,
                        },
                        styleContainerBtn,
                    ]}
                >
                    {!Utils.isNull(textBtnOne) ? (
                        <ButtonCustom
                            noShadow
                            containerStyle={{ flex: 1 }}
                            style={[
                                {
                                    marginRight: Constants.MARGIN8,
                                    backgroundColor: Colors.COLOR_WHITE,
                                    borderWidth: Constants.BORDER_WIDTH,
                                    borderColor: Colors.COLOR_PRIMARY,
                                    padding: Constants.PADDING8 - 1,
                                },
                                styleItemBtn,
                            ]}
                            styleTitle={{ color: Colors.COLOR_PRIMARY }}
                            onPress={() => {
                                onPressBtnOne ? onPressBtnOne() : onPressX();
                            }}
                            title={textBtnOne}
                        />
                    ) : null}
                    <ButtonCustom
                        noShadow
                        containerStyle={{ flex: 1 }}
                        style={[
                            {
                                marginLeft: Constants.MARGIN8,
                                padding: Constants.PADDING8,
                            },
                            styleItemBtn,
                        ]}
                        onPress={() => {
                            onPressBtnPositive();
                        }}
                        title={textBtnTwo}
                    />
                </View>
            </View>
        );
    }

    _renderOutsideTouchable(onTouch) {
        const view = <View style={{ flex: 1, width: '100%' }} />;

        // if (!onTouch) return view;

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.showDialog(false);
                    onTouch && onTouch();
                }}
                style={{ flex: 1, width: '100%' }}
            >
                {view}
            </TouchableWithoutFeedback>
        );
    }

    render() {
        const { onTouchOutside, contentText, contentTitle } = this.props;
        return (
            <Dialog
                visible={this.state.visible}
                dialogStyle={[
                    commonStyles.shadowOffset,
                    {
                        borderRadius: Constants.CORNER_RADIUS,
                        backgroundColor: Colors.COLOR_WHITE,
                    },
                ]}
                onTouchOutside={() => {
                    onTouchOutside && onTouchOutside();
                }}
                renderContent={() => {
                    return (
                        <View
                            style={{
                                marginTop: Constants.MARGIN8,
                            }}
                        >
                            {!StringUtil.isNullOrEmpty(contentTitle)
                                ? this.renderTitle()
                                : null}
                            <Hr style={{ marginTop: 4 }} />
                            {!StringUtil.isNullOrEmpty(contentText)
                                ? this.renderContentText()
                                : null}
                            {this.props.isVisibleContentCustom
                                ? this.props.contentCustom
                                : null}
                            {this.props.isVisibleContentForChooseImg
                                ? this.renderContentForChooseImg()
                                : null}
                            {this.props.isVisibleTwoButton
                                ? this.renderTwoButton()
                                : null}
                            {this.props.isVisibleOneButton
                                ? this.renderOneButton()
                                : null}
                        </View>
                    );
                }}
            />
        );
    }
}

export default DialogCustom;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE,
    },
    card: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    text: {
        textAlign: 'center',
        fontSize: 50,
        backgroundColor: 'transparent',
    },
    done: {
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        backgroundColor: 'transparent',
    },
    btnClose: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: Constants.PADDING8,
    },
});
