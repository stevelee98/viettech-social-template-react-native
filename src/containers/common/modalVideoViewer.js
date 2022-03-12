import VideoPlayer from 'components/videoPlayer';
import BaseView from 'containers/base/baseView';
import ic_cancel_white from 'images/ic_cancel_white.png';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    View,
} from 'react-native';
import WebView from 'react-native-webview';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

const screen = Dimensions.get('window');

export default class ModalVideoViewer extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            pathVideo: [],
            videoRotate: '90deg',
            index: 0,
        };
        this.videoId = null;
        this.uri = null;
    }

    componentDidMount() {
        this.getSourceUrlPath();
    }

    showModal(pathVideo, index) {
        this.setState({
            isVisible: true,
            pathVideo,
            index,
        });
        pathVideo.forEach((item, index) => {
            if (
                item.url.indexOf('youtube.com') !== -1 ||
                item.url.indexOf('youtu.be') !== -1 ||
                item.url.indexOf('tiktok.com') !== -1
            ) {
                this.videoId = pathVideo[index].url;
            } else {
                this.uri = pathVideo[index].url;
            }
        });
        StatusBar.setHidden(true);
    }

    hideModal() {
        this.setState({
            isVisible: false,
        });
        StatusBar.setHidden(false);
    }

    render() {
        const { isVisible, pathVideo, index } = this.state;
        return (
            <SafeAreaView>
                <Modal
                    ref={'modalVideoViewer'}
                    onRequestClose={() => this.hideModal()}
                    visible={isVisible}
                    transparent={true}
                    useNativeDriver={true}
                    style={{
                        backgroundColor: Colors.COLOR_TRANSPARENT,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    backdrop={true}
                    backdropPressToClose={false}
                    onClosed={() => {
                        this.hideModal();
                    }}
                >
                    {!Utils.isNull(this.videoId) && index == 0 ? (
                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'black',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <WebView
                                    style={{ opacity: 0.99 }}
                                    ref={ref => (this.webview = ref)}
                                    // androidHardwareAccelerationDisabled={true}
                                    source={{
                                        uri: !Utils.isNull(
                                            this.getYoutubeVideoId(
                                                this.videoId,
                                            ),
                                        )
                                            ? `https://www.youtube.com/embed/${this.getYoutubeVideoId(
                                                  this.videoId,
                                              )}?
                                                    autoplay=1
                                                    &controls=1
                                                    &showinfo=0
                                                    &modestbranding=1`
                                            : this.videoId,
                                    }}
                                    startInLoadingState={true}
                                    renderLoading={() => (
                                        <ActivityIndicator
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                right: 0,
                                                top: 0,
                                                bottom: 0,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            color={Colors.COLOR_BLUE_LIGHT}
                                            size="large"
                                        />
                                    )}
                                    useWebKit={true}
                                    allowsInlineMediaPlayback={false}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            alignSelf: 'flex-end',
                                            margin: Constants.MARGIN8 + 2,
                                            padding: Constants.PADDING + 2,
                                            borderRadius:
                                                Constants.BORDER_RADIUS,
                                        }}
                                        onPress={() => this.hideModal()}
                                    >
                                        <Image source={ic_cancel_white} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ) : !Utils.isNull(this.uri) ? (
                        <VideoPlayer
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: Colors.COLOR_BLACK,
                            }}
                            source={{ uri: this.uri }}
                            isFullScreen={true}
                            paused={false}
                            onLoad={response => {
                                console.log(response);
                            }}
                            onProgress={response => {}}
                            onEnd={response => {}}
                            showOnStart={true}
                            onExitFullscreen={() => {
                                this.hideModal();
                            }}
                        />
                    ) : null}
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor:
                                    Colors.COLOR_BACKGROUND_BUTTON_HEADER,
                                borderRadius: Constants.BORDER_RADIUS,
                                padding: Constants.PADDING + 2,
                                alignSelf: 'flex-end',
                                margin: Constants.PADDING16,
                            }}
                            onPress={() => this.hideModal()}
                        >
                            <Image source={ic_cancel_white} />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }

    /**
     * Get youtube video id
     */
    getYoutubeVideoId = url => {
        let videoId = url.split('v=')[1] || url.split('youtu.be/')[1];
        if (!Utils.isNull(videoId)) {
            var ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition != -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
            return videoId;
        } else {
            return null;
        }
    };
}
