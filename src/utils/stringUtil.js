export default class StringUtil {
    /**
     * Check is null or empty
     * @param {*} string
     */
    static isNullOrEmpty = (string = '') => {
        return (
            !string ||
            string == undefined ||
            string == '' ||
            string.length == 0 ||
            (typeof string === 'string' && string.trim().length == 0)
        );
    };

    static containSpecialCharacter = string => {
        return string.match(/[!@#$%^&*=+;`'(),.?":{}|[<>/\\\]~_-]/);
    };

    static containEmojiIcon = string => {
        return string.match(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            '',
        );
    };

    static formatMoney(number, unit = '') {
        try {
            let num = Number(number);
            if (isNaN(num)) return '-';
            let fixed = Number.isInteger(num) ? 0 : 1;
            num = num.toFixed(fixed).toString().replace(/\./g, ',');
            if (fixed == 0)
                return (
                    num.replace(/\B(?=(\d{3})+$)/g, '.') +
                    `${unit != '' ? ' ' + unit : ''}`
                );
            return (
                num.replace(/\d(?=(\d{3})+\,)/g, '$&.') +
                `${unit != '' ? ' ' + unit : ''}`
            );
        } catch (error) {
            return '0';
        }
    }

    static randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i)
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    static getNumberInString = str => {
        var string = str.trim(); // ex:
        var res = string.replace(/\D/g, '');
        return res;
    };

    /**
     * format phone space
     * @param {*} str
     */
    static formatPhoneSpace(str) {
        var one = '';
        var two = '';
        var there = '';
        if (str.length == 10) {
            var one = str.slice(0, 3);
            var two = str.slice(3, 6);
            var there = str.slice(6, 10);
        } else if (str.length == 11) {
            var one = str.slice(0, 4);
            var two = str.slice(4, 7);
            var there = str.slice(7, 11);
        }
        return one + ' ' + two + ' ' + there;
    }

    static phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    static containNumber = string => {
        return string.match(/[0-9]/g);
    };

    static formatNumber(number) {
        let result = number;
        if (number > 1000 && number < 1000000) {
            let div = Math.round((number / 1000) * 10) / 10;
            return div + 'k';
        } else if (number >= 1000000) {
            let div = Math.round((number / 1000000) * 100) / 100;
            return div + 'tr';
        }
        return result;
    }
}
