import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';

export class CalendarScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            isDateTimePickerVisible: false,
        };
        this.chooseDate = this.props.chooseDate;
        this.show = false;
    }

    showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    hideDateTimePicker = () =>
        this.setState({ isDateTimePickerVisible: false });

    handleDatePicked = datetime => {
        this.setState(
            {
                isDateTimePickerVisible: false,
                selected: datetime,
            },
            () => this.onSaveChange(),
        );
    };

    render() {
        const { selected, isDateTimePickerVisible } = this.state;
        const { dateCurrent, minimumDate, maximumDate, mode } = this.props;
        let date = !Utils.isNull(selected) ? selected : dateCurrent;
        return (
            <View>
                <DateTimePicker
                    ref={ref => (this.showCalendar = ref)}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate}
                    isVisible={isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    date={date ? new Date(date) : new Date()}
                    mode={mode ?? 'date'}
                />
            </View>
        );
    }

    /**
     * Select day
     */
    onDaySelect(date) {
        this.setState({
            selected: date,
        });
    }

    /**
     * Save date choose dialog
     */
    onSaveChange() {
        this.chooseDate(
            this.state.selected ? this.state.selected : this.props.dateCurrent,
        );
    }
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        padding: 10,
        fontWeight: 'bold',
        color: Colors.COLOR_WHITE,
    },
    barView: {
        backgroundColor: Colors.COLOR_ORANGE,
    },
    daySelectedText: {
        fontWeight: 'bold',
        backgroundColor: Colors.COLOR_ORANGE,
        color: Colors.COLOR_WHITE,
        borderRadius: 15,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
});
