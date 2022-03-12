import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  fullTextWrapper: {
    opacity: 0,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  viewMoreText: {
    color: 'blue',
  },
  transparent: {
    opacity: 0,
  },
});

class ViewMoreText extends React.PureComponent {
  trimmedTextHeight = null;
  fullTextHeight = null;
  shouldShowMore = false;

  state = {
    isFulltextShown: true,
    numberOfLines: this.props.numberOfLines,
    reload: true,
    text: this.props.children
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.children !== nextProps.children) {
      this.props = nextProps;
      setTimeout(() => {
        this.setState({
          isFulltextShown: true
        })
      }, 30);
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return true;
  };

  hideFullText = () => {
    if (
      this.state.isFulltextShown &&
      this.trimmedTextHeight &&
      this.fullTextHeight
    ) {
      this.shouldShowMore = this.trimmedTextHeight < this.fullTextHeight;
      this.setState({
        isFulltextShown: false,
      });
    }
  }

  onLayoutTrimmedText = (event) => {
    const {
      height,
    } = event.nativeEvent.layout;
    this.trimmedTextHeight = height;
    this.fullTextHeight = null;
    this.hideFullText();
  }

  onLayoutFullText = (event) => {
    const {
      height,
    } = event.nativeEvent.layout;
    this.fullTextHeight = height;
    this.hideFullText();
  }

  onPressMore = () => {
    this.setState({
      numberOfLines: null,
    }, () => {
      this.props.afterExpand();
    });
  }

  onPressLess = () => {
    this.setState({
      numberOfLines: this.props.numberOfLines,
    }, () => {
      this.props.afterCollapse();
    });
  }

  getWrapperStyle = () => {
    if (this.state.isFulltextShown) {
      return styles.transparent;
    }
    return {};
  }

  renderViewMore = () => (
    <Text
      style={styles.viewMoreText}
      onPress={this.onPressMore}
    >
      View More
    </Text>
  )

  renderViewLess = () => (
    <Text
      style={styles.viewMoreText}
      onPress={this.onPressLess}
    >
      View Less
    </Text>
  )

  renderFooter = () => {
    const {
      numberOfLines,
    } = this.state;

    if (this.shouldShowMore === true) {
      if (numberOfLines > 0) {
        return (this.props.renderViewMore || this.renderViewMore)(this.onPressMore);
      }
      return (this.props.renderViewLess || this.renderViewLess)(this.onPressLess);
    }
    return null;
  }

  renderFullText = () => {
    if (this.state.isFulltextShown) {
      return (
        <View onLayout={this.onLayoutFullText} style={styles.fullTextWrapper}>
          {/* <Text style={this.props.textStyle}>{this.props.children}</Text> */}
          <Text style={this.props.textStyle}>{this.state.text}</Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={this.getWrapperStyle()}>
        <View onLayout={this.onLayoutTrimmedText}>
          <Text
            style={this.props.textStyle}
            numberOfLines={this.state.numberOfLines}
          >
            {/* {this.props.children} */}
            {/* {this.state.text} */}
            {this.props.children}
          </Text>
          {this.renderFooter()}
        </View>

        {
          this.state.isFulltextShown &&
          <View onLayout={this.onLayoutFullText} style={styles.fullTextWrapper}>
            {/* <Text style={this.props.textStyle}>{this.props.children}</Text> */}
            <Text style={this.props.textStyle}>{this.props.children}</Text>
          </View>
        }
        {/* {this.renderFullText()} */}
      </View>
    );
  }
}

ViewMoreText.propTypes = {
  renderViewMore: PropTypes.func,
  renderViewLess: PropTypes.func,
  afterCollapse: PropTypes.func,
  afterExpand: PropTypes.func,
  numberOfLines: PropTypes.number.isRequired,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

ViewMoreText.defaultProps = {
  afterCollapse: () => { },
  afterExpand: () => { },
  textStyle: {},
};

export default ViewMoreText;