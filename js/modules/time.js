// define module: time
define([
    "require",
    "exports",
], function (
    require,
    exports,
) {
    // set initial time extent
    const initialTimeExtent = {
        start: new Date(2020, 11, 14),  // 2020.12.14 new Date(year, monthIndex, day)
        end: new Date(2021, 6, 3)       //  2021.7.3  new Date(year, monthIndex, day)
    }

    dateToDateField = function (date) {
        let dateField = "date_" + ("0" + (date.getMonth() + 1)).slice(-2) + "_" + ("0" + date.getDate()).slice(-2) + "_" + date.getFullYear();
        return dateField;
    }

    exports.initialTimeExtent = initialTimeExtent;
    exports.dateToDateField = dateToDateField;
});
