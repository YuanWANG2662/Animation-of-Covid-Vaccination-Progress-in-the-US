// define module: popupUtils
define([
    "require",
    "exports",
    "esri/popup/ExpressionInfo",
    "./js/modules/time.js"
], function (
    require,
    exports,
    ExpressionInfo,
    time,
) {
    //
    function createTotalVaccinationExpression(currentDateFieldName) {
        return "\n    var currentDayFieldName = \"" + currentDateFieldName + "\";\n    var totalVaccinations = $feature[currentDayFieldName];\n\n    return totalVaccinations;\n  ";
    }

    function createTotalVaccinationsExpressionInfos(timeExtent) {
        var expressionInfos = [];
        const startDate = timeExtent.start;
        const endDate = timeExtent.end;
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = time.dateToDateField(currentDate)
            expressionInfos.push(new ExpressionInfo({
                name: "total_vaccinations_" + currentFieldName,
                title: currentFieldName,
                expression: createTotalVaccinationExpression(currentFieldName)
            }));
            currentDate.setDate(currentDate.getDate() + 1)
        }
        return expressionInfos;
    }

    var totalVaccinationsExpressionInfos = createTotalVaccinationsExpressionInfos(time.initialTimeExtent);

    var totalVaccinationsExpressionNameList = totalVaccinationsExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });

    createPopupTemplate = function (popopType, dateField) {
        switch (popopType) {
            case 'total-doses': {
                const template = {
                    title: "{NAME}, {STUSPS}, " + dateField.slice(-4) + "/" + dateField.slice(-10, -8) + "/" + dateField.slice(-7, -5),
                    content: [
                        {
                            type: "fields",
                            fieldInfos: [
                                {
                                    fieldName: dateField, // The field whose values you want to format
                                    label: "Total Vaccine Doses",
                                    format: {
                                        digitSeparator: true, // Uses a comma separator in numbers >999
                                    }
                                }]
                        },
                        {
                            type: "media",
                            mediaInfos: [{
                                type: "line-chart",
                                title: "Total Vaccinations Time Serie",
                                value: {
                                    fields: totalVaccinationsExpressionNameList
                                }
                            }]
                        }
                    ],
                    expressionInfos: totalVaccinationsExpressionInfos
                };

                return template;
            }
            case 'vaccination-rate': {
                const template = {
                    title: "{NAME}, {STUSPS}, " + dateField.slice(-4) + "/" + dateField.slice(-10, -8) + "/" + dateField.slice(-7, -5),
                    content: [
                        {
                            type: "fields",
                            fieldInfos: [
                                {
                                    fieldName: "expression/vaccination_rate", // The field whose values you want to format
                                    label: "Total Vaccinations per Hundred",
                                    format: {
                                        places: 2 // Sets the number of decimal places to 2 and rounds up
                                    }
                                }]
                        }],
                    expressionInfos: [
                        {
                            name: "vaccination_rate",
                            title: "Total Vaccinations per Hundred",
                            expression: "($feature." + dateField + "/$feature.Population)*100"
                        }]
                };
                return template;
            }
        }

    }

    updatePopupTemplate = function (layer, popopType, dateField) {
        const template = createPopupTemplate(popopType, dateField);
        layer.popupTemplate = template;
    }

    exports.createPopupTemplate = createPopupTemplate;
    exports.updatePopupTemplate = updatePopupTemplate;


});