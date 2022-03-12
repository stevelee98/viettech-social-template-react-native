import { localizes } from 'locales/i18n';
import moment from 'moment';
import StringUtil from './stringUtil';

export default class DateUtil {
    static FORMAT_DATE = 'DD/MM/YYYY';
    static FORMAT_DATE_SQL = 'YYYY-MM-DD';
    static FORMAT_DATE_TIME_ZONE = 'YYYY-MM-DD HH:mm:ss.SSSZZZ';
    static FORMAT_DATE_TIME_ZONE_T = 'YYYY-MM-DDTHH:mm:ss.sssZ';
    static FORMAT_DATE_TIME_ZONE_A = 'HH:mm DD/MM/YYYY';
    static FORMAT_TIME = 'HH:mm';
    static FORMAT_TIME_SECOND = 'HH:mm:ss';
    static FORMAT_TIME_SECONDS = 'hh:mm:ss';
    static FORMAT_DATE_TIME =
        DateUtil.FORMAT_DATE + ' - ' + DateUtil.FORMAT_TIME;
    static FORMAT_DATE_TIMES =
        DateUtil.FORMAT_DATE_SQL + ' ' + DateUtil.FORMAT_TIME_SECONDS;
    static FORMAT_DATE_TIME_SQL =
        DateUtil.FORMAT_DATE + ' ' + DateUtil.FORMAT_TIME_SECOND;
    static FORMAT_TIME_HOUR = 'HH'; //Format hour
    static FORMAT_TIME_MINUTE = 'mm'; //Format minute
    static FORMAT_MONTH_YEAR = 'MM/YYYY'; //Format month year
    static FORMAT_MONTH = 'MM';
    static FORMAT_YEAR = 'YYYY';
    static FORMAT_DAY = 'DD';
    static FORMAT_DAYS = 'dddd';
    static FORMAT_DATE_MONTH = 'DD-MM';
    static FORMAT_TIME_DATE_MONTH = 'HH:mm - DD/MM';
    static FORMAT_TIME_DATE = 'HH:mm - DD/MM/YYYY';
    static FORMAT_MONTH_YEAR_T = 'MM/YY';
    static FORMAT_TIME_CUSTOM = 'HH:mm - HH:mm';
    static FORMAT_DATE_CUSTOM =
        DateUtil.FORMAT_TIME_CUSTOM + ' ' + DateUtil.FORMAT_DATE;
    static FORMAT_DATE_TIME_EN = 'YYYY/MM/DD HH:mm:ss';

    static now() {
        return new Date(Date.now());
    }

    /**
     * Get time ago notification
     * @param {*} time
     */
    static timeAgo(time) {
        var currentDate = new Date();
        var currentDateTime = new Date(currentDate);
        let formatTime = DateUtil.convertFromFormatToFormat(
            time,
            DateUtil.FORMAT_DATE_TIME_ZONE,
            DateUtil.FORMAT_DATE_TIME_ZONE_T,
        );
        var date = new Date(formatTime);
        var diff = (currentDateTime.getTime() - date.getTime()) / 1000;
        var day_diff = Math.floor(diff / 86400);
        if (isNaN(day_diff) || day_diff < 0) return localizes('just');
        return (
            (day_diff == 0 &&
                ((diff < 60 && localizes('just')) ||
                    (diff < 120 && localizes('oneMinuteAgo')) ||
                    (diff < 3600 &&
                        Math.floor(diff / 60) + localizes('minAgo')) ||
                    (diff < 7200 && localizes('oneHoursAgo')) ||
                    (diff < 86400 &&
                        Math.floor(diff / 3600) + localizes('hoursAgo')))) ||
            (day_diff == 1 && localizes('yesterday')) ||
            (day_diff < 7 && day_diff + localizes('sometime')) ||
            (day_diff < 31 &&
                Math.ceil(day_diff / 7) + localizes('lastweek')) ||
            (day_diff > 31 && Math.ceil(day_diff / 30) + localizes('lastmonth'))
        );
    }
    static convertFromFormatToFormat(date, fromFormat, toFormat) {
        if (StringUtil.isNullOrEmpty(date)) {
            return '';
        }
        return moment(date, fromFormat).format(toFormat);
    }
    /**
     * Get time ago day
     * @param {*} time
     */
    static timeAgoDay(time) {
        var currentDate = new Date();
        var currentDateTime = new Date(currentDate);
        let formatTime = DateUtil.convertFromFormatToFormat(
            time,
            DateUtil.FORMAT_DATE_TIME_ZONE,
            DateUtil.FORMAT_DATE_TIME_ZONE_T,
        );
        let day = DateUtil.convertFromFormatToFormat(
            time,
            DateUtil.FORMAT_DATE_TIME_ZONE,
            DateUtil.FORMAT_DATE,
        );
        let hour = DateUtil.convertFromFormatToFormat(
            time,
            DateUtil.FORMAT_DATE_TIME_ZONE,
            DateUtil.FORMAT_TIME,
        );
        var date = new Date(formatTime);
        var diff = (currentDateTime.getTime() - date.getTime()) / 1000;
        var day_diff = Math.floor(diff / 86400);
        if (isNaN(day_diff) || day_diff < 0) return localizes('just');
        return (
            (day_diff == 0 &&
                ((diff < 60 && localizes('just')) ||
                    (diff < 120 && localizes('oneMinuteAgo')) ||
                    (diff < 3600 &&
                        Math.floor(diff / 60) + localizes('minAgo')) ||
                    (diff < 7200 && localizes('oneHoursAgo')) ||
                    (diff < 86400 &&
                        Math.floor(diff / 3600) + localizes('hoursAgo')))) ||
            (day_diff >= 1 &&
                day_diff <= 3 &&
                day_diff + localizes('hsomedate')) ||
            (day_diff > 3 && day)
        );
    }

    /**
     * Get time post newfeed
     * @param {*} time
     */
    static timePostNewfeed(time) {
        let currentDate = new Date();
        let formatTime = moment(time, DateUtil.FORMAT_DATE_TIME_ZONE).format(
            DateUtil.FORMAT_DATE_TIME_ZONE_T,
        );
        let day = moment(time, DateUtil.FORMAT_DATE_TIME_ZONE).format(
            'DD-MM-YYYY',
        );
        let date = new Date(formatTime);
        let diff = (currentDate.getTime() - date.getTime()) / 1000;
        let day_diff = Math.floor(diff / 86400);
        if (isNaN(day_diff) || day_diff < 0) return localizes('just');
        let hour = moment(time, DateUtil.FORMAT_DATE_TIME_ZONE).format(
            DateUtil.FORMAT_TIME,
        );
        return day + ' ' + localizes('at_time').toLowerCase() + ' ' + hour;
    }
}
