import ImageLoader from 'components/imageLoader';
import MainList from 'components/mainList';
import { localizes } from 'locales/i18n';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import { Constants } from 'values/constants';
import ItemChildComment from './itemChildComment';
import styles from './styles';

const ItemComment = props => {
    const { item, index, openModalChildComment, showChild = true } = props;
    let hasChild =
        item.childs !== null &&
        Array.isArray(item.childs) &&
        item.childs.length > 0;
    let isChild = item.parent_id != null;

    const renderAvatar = () => {
        return (
            <Pressable
                style={styles.avatarBtn}
                android_ripple={Constants.ANDROID_RIPPLE}
            >
                <ImageLoader
                    path={item.user?.avatar}
                    style={{
                        ...styles.avatarComment,
                        width: isChild
                            ? Constants.AVATAR_CHILD_COMMENT
                            : Constants.AVATAR_COMMENT,
                        height: isChild
                            ? Constants.AVATAR_CHILD_COMMENT
                            : Constants.AVATAR_COMMENT,
                    }}
                    resizeModeType={'cover'}
                />
            </Pressable>
        );
    };

    const renderContent = () => {
        return (
            <View style={styles.contentView}>
                <Pressable style={styles.commentContent}>
                    <Text style={commonStyles.textBold}>
                        {item.user ? item.user.name : ''}
                    </Text>
                    <Text style={commonStyles.text}>{item.content}</Text>
                </Pressable>
                <View style={styles.bottomComment}>
                    <Text style={styles.txtTimeComment}>
                        {DateUtil.timePostNewfeed(item.created_at)}
                    </Text>
                    <Pressable style={{ marginLeft: Constants.MARGIN12 }}>
                        <Text style={commonStyles.textXSmallBold}>
                            {localizes('feedback')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    const renderChilds = () => {
        return (
            <Pressable
                android_ripple={Constants.ANDROID_RIPPLE}
                onPress={() => {
                    openModalChildComment(item);
                }}
            >
                <MainList
                    style={{
                        flex: 1,
                    }}
                    ListHeaderComponent={renderHeaderChildComment}
                    data={item.childs}
                    keyExtractor={item => item.id}
                    renderItem={renderItemChildComments}
                    showsVerticalScrollIndicator={false}
                    isShowImageEmpty={true}
                />
            </Pressable>
        );
    };

    const renderHeaderChildComment = () => {
        const itemChildShow = 2;
        let numChildHide = 0;
        if (hasChild && item.childs.length > itemChildShow) {
            numChildHide = item.childs.length - itemChildShow;
        }
        if (numChildHide > 0)
            return (
                <Text
                    style={{
                        ...commonStyles.textXSmallBold,
                        marginLeft: Constants.MARGIN16,
                    }}
                >
                    {localizes('view_more') +
                        ' ' +
                        numChildHide +
                        ' ' +
                        localizes('a_anwser')}
                </Text>
            );
        return <View></View>;
    };

    const renderItemChildComments = e => {
        console.log('item.childs?.length', e);
        return (
            <ItemChildComment
                lengthData={item.childs?.length}
                item={e.item}
                index={e.index}
            />
        );
    };

    return (
        <View
            style={{
                marginTop: Constants.MARGIN8,
                marginRight: Constants.MARGIN16,
                marginLeft: isChild
                    ? Constants.AVATAR_COMMENT +
                      Constants.MARGIN16 +
                      Constants.MARGIN8
                    : Constants.MARGIN16,
            }}
        >
            <View style={styles.contentCommentStyles}>
                {renderAvatar()}
                {renderContent()}
            </View>
            {showChild && hasChild && (
                <View style={{ marginLeft: 24 }}>{renderChilds()}</View>
            )}
        </View>
    );
};

export default React.memo(ItemComment);
